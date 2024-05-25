import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
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
import { AngularFireService } from 'src/app/services/angular-fire.service';

@Component({
  selector: 'app-cosas-feas',
  templateUrl: './cosas-feas.component.html',
  styleUrls: ['./cosas-feas.component.scss'],
})
export class CosasFeasComponent implements OnInit {
  assetBasePath: string = 'assets/images/home/malo.jpg';
  alt: string = 'cosas-feas';
  fotosFeas: { url: string, metadata: any }[] = [];
  currentEmail = '';

  constructor(private firestore: AngularFirestore, private cdRef: ChangeDetectorRef, private angularFireService: AngularFireService) {}

  async ngOnInit() {
    await this.updateFotosFeas();
    this.currentEmail = await this.angularFireService.GetEmailLogueado();
  }

  //#region tomar foto

  async takePhoto() {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64, // file-based data; provides best performance
      source: CameraSource.Camera, // automatically take a new photo with the camera
      quality: 30, // highest quality (0 to 100)
      promptLabelHeader: 'fea',
    });

    if (cameraPhoto.base64String != undefined) {
      const blob = new Blob(
        [new Uint8Array(decode(cameraPhoto.base64String))],
        {
          type: `image/${cameraPhoto.format}`,
        }
      );

      const file = new File([blob], 'fea', {
        lastModified: moment().unix(),
        type: blob.type,
      });
      const storage = getStorage();
      const storageRef = ref(
        storage,
        'fotos_feas/' + 'user-b_' + moment().unix()
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
        await this.updateFotosFeas(); // Actualiza las fotos después de subir la nueva foto
      }).catch(error => {
        console.error('Error al subir la foto:', error);
      });
    }
  }

  //#endregion

  //#region Obtener fotos
  async getFotosFeas(): Promise<{ url: string, metadata: any }[]> {
    const storage = getStorage();
    const storageRef = ref(storage, 'fotos_feas');
  
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

  //#endregion

  //#region Refrescar imagenes
  async updateFotosFeas() {
    this.fotosFeas = await this.getFotosFeas();
    console.log('Nuevas fotos feas:', this.fotosFeas);
    this.cdRef.detectChanges(); // Asegúrate de que los cambios se detecten
  }
  //#endregion

  //#region Me gusta

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
          this.updateFotosFeas();
        }).catch((error) => {
          // Uh-oh, ocurrió un error!
          console.error('Error al actualizar metadatos:', error);
        });
    }).catch((error) => {
      console.error('Error al obtener metadatos:', error);
    });
  }
  //#endregion
}
