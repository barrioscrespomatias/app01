import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserPhoto } from 'src/app/interfaces/userPhoto';
import { FileService } from 'src/app/services/file.service';
import { AngularFireService } from 'src/app/services/angular-fire.service';
import { decode } from 'base64-arraybuffer';
import * as moment from 'moment';
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
  getMetadata,
  updateMetadata
} from 'firebase/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, tap } from 'rxjs';

@Component({
  selector: 'app-cosas-lindas',
  templateUrl: './cosas-lindas.component.html',
  styleUrls: ['./cosas-lindas.component.scss'],
})
export class CosasLindasComponent implements OnInit {
  assetBasePath: string = 'assets/images/home/bueno.jpg';
  alt: string = 'cosas-lindas';
  fotosLindas: { url: string, metadata: any }[] = [];
  currentEmail = '';

  constructor(private firestore: AngularFirestore, private cdRef: ChangeDetectorRef, private angularFireService: AngularFireService) {}

  async ngOnInit() {
    await this.updateFotoslindas();
    this.currentEmail = await this.angularFireService.GetEmailLogueado();
  }

  async takePhoto() {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64, // file-based data; provides best performance
      source: CameraSource.Camera, // automatically take a new photo with the camera
      quality: 30, // highest quality (0 to 100)
      promptLabelHeader: 'linda',
    });

    if (cameraPhoto.base64String != undefined) {
      const blob = new Blob(
        [new Uint8Array(decode(cameraPhoto.base64String))],
        {
          type: `image/${cameraPhoto.format}`,
        }
      );

      const file = new File([blob], 'linda', {
        lastModified: moment().unix(),
        type: blob.type,
      });

      

      const storage = getStorage();
      const storageRef = ref(
        storage,
        'fotos_lindas/' + 'user-b_' + moment().unix()
      );

      const metadata = {
        customMetadata: {
          'user': this.currentEmail,
          'votes': '0'
        }
      };

      // Espera a que la foto se suba y luego actualiza las fotos
      await uploadBytes(storageRef, file, metadata).then(async (snapshot) => {
        console.log('Foto subida con éxito:', snapshot);
        await this.updateFotoslindas(); // Actualiza las fotos después de subir la nueva foto
      }).catch(error => {
        console.error('Error al subir la foto:', error);
      });
    }
  }

  async getFotoslindas(): Promise<{ url: string, metadata: any }[]> {
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
      
      console.log('URLs y metadatos descargados:', fotosConMetadatos);
      return fotosConMetadatos;
    } catch (error) {
      console.error('Error al obtener las fotos lindas:', error);
      return [];
    }
  }

  async updateFotoslindas() {
    this.fotosLindas = await this.getFotoslindas();
    this.cdRef.detectChanges(); // Asegúrate de que los cambios se detecten
  }

  accionMegusta(url: string, votos: string) {
    const storage = getStorage();
    const forestRef = ref(storage, url);
  
    getMetadata(forestRef).then((metadata) => {
      const customMetadata = metadata.customMetadata || {};
      const currentUser = this.currentEmail;
      const currentVoters = customMetadata['voters'] ? JSON.parse(customMetadata['voters']) : [];
  
      // Verificar si el usuario ya ha votado
      if (currentVoters.includes(currentUser)) {
        console.log('Este usuario ya ha votado.');
        return;
      }
  
      // Convertir votos a número, incrementar en 1 y luego convertir de nuevo a string
      let votosInt = parseInt(votos, 10);
      votosInt += 1;
      const nuevosVotos = votosInt.toString();
  
      // Añadir el usuario actual a la lista de votantes
      currentVoters.push(currentUser);
  
      // Crear nuevos metadatos para actualizar
      const newMetadata = {
        customMetadata: {
          'user': currentUser,
          'votes': nuevosVotos,
          'voters': JSON.stringify(currentVoters) // Guardar la lista de votantes como un string JSON
        }
      };
  
      // Actualizar propiedades de los metadatos
      updateMetadata(forestRef, newMetadata)
        .then((metadata) => {
          // Metadatos actualizados son retornados en el Promise
          this.updateFotoslindas();
        }).catch((error) => {
          // Uh-oh, ocurrió un error!
          console.error('Error al actualizar metadatos:', error);
        });
    }).catch((error) => {
      console.error('Error al obtener metadatos:', error);
    });
  }
  
}
