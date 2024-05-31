import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getDownloadURL, getMetadata, getStorage, listAll, ref } from 'firebase/storage';
import Chart from 'chart.js/auto'
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.scss'],
})
export class GraficosComponent implements OnInit {
  constructor(private router: Router, private navCtrl: NavController) {}

  // Cantidad de turnos por especialidad
  data1: number[] = [];
  chartsLabels1: Array<any> = [];
  title = 'Imagenes con mas likes';
  type = 'bar';
  chartSelector1 = '.chart-1';
  fotosLindas: { url: string, metadata: any }[] = [];

  async ngOnInit() {
    //#region chart-1
    const ranking = await this.getFotoslindas();
    this.data1 = ranking.map(foto => foto.votos);
    this.chartsLabels1 = ranking.map(foto => foto.metadata.name);
    //#endregion

    const ctx = document.getElementById('myChart');

    console.log(this.chartsLabels1)

  const myChart = new Chart("ctx", {
      type: 'bar',      
      data: {
          // labels: this.chartsLabels1,
          labels: this.chartsLabels1,
          datasets: [{
              label: '# de votos',
              data: this.data1,
              backgroundColor: [
                'rgba(255, 99, 132, 0.8)',  // rojo
                'rgba(54, 162, 235, 0.8)',  // azul
                'rgba(255, 206, 86, 0.8)',  // amarillo
                'rgba(75, 192, 192, 0.8)',  // verde agua
                'rgba(153, 102, 255, 0.8)', // púrpura
                'rgba(255, 159, 64, 0.8)'   // naranja
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',    // rojo
                'rgba(54, 162, 235, 1)',    // azul
                'rgba(255, 206, 86, 1)',    // amarillo
                'rgba(75, 192, 192, 1)',    // verde agua
                'rgba(153, 102, 255, 1)',   // púrpura
                'rgba(255, 159, 64, 1)'     // naranja
              ],
              borderWidth: 1
          }]
      },
      options: {
        scales: {
          y: {
            display: false, // vertical
            beginAtZero: true 
          },
          x: {
            display: true // horizontal
          }
      }
      }
  });
  }  

  async getFotoslindas(): Promise<{ url: string, metadata: any, votos: number }[]> {
    const storage = getStorage();
    const storageRef = ref(storage, 'fotos_lindas');

    try {
      const result = await listAll(storageRef);
      console.log(result);

      const fotosConMetadatos = await Promise.all(
        result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const metadata = (await getMetadata(item)).customMetadata;
          return { url, metadata };
        })
      );

      // Ordena las fotos por fecha de creación en orden descendente
      fotosConMetadatos.sort((a, b) => {
        if (a.metadata && b.metadata && a.metadata['createdAt'] && b.metadata['createdAt']) {
          const dateA = new Date(a.metadata['createdAt']);
          const dateB = new Date(b.metadata['createdAt']);
          return dateB.getTime() - dateA.getTime();
        } else {
          return 0; // Si falta algún dato, deja el orden sin cambios
        }
      });

      // Agrupar las fotos por votos y ordenar por la cantidad de votos
      const votosMap = new Map<string, { url: string, metadata: any, votos: number }>();

      fotosConMetadatos.forEach((foto) => {
        const nombre = foto.metadata?.['name'] || foto.url; // Usar nombre o URL como clave
        const votos = parseInt(foto.metadata?.['votes'] || '0', 10); // Obtener votos, convertir a número
        
        if(votos > 0){
          if (votosMap.has(nombre)) {
            votosMap.get(nombre)!.votos += votos; // Sumar votos si ya existe
          } else {
            votosMap.set(nombre, { ...foto, votos }); // Crear nueva entrada si no existe
          }
        }
      });

      const ranking = Array.from(votosMap.values()).sort((a, b) => b.votos - a.votos);

      console.log('Ranking de imágenes por votos:', ranking);
      return ranking;
    } catch (error) {
      console.error('Error al obtener las fotos lindas:', error);
      return [];
    }
  }

  ReloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router
      .navigateByUrl('/refreshPage', { skipLocationChange: true })
      .then(() => {
        this.router.navigate([currentUrl]);
      });
  }

  navigateTo(section: string) {
    this.navCtrl.navigateForward(`/${section}`);
  }
}
