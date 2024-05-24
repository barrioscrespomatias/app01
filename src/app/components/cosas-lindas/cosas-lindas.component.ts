import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserPhoto } from 'src/app/interfaces/userPhoto';
import { FileService } from 'src/app/services/file.service';
import { decode } from 'base64-arraybuffer';
import * as moment from 'moment';
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
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
  fotosLindas: string[] = [];

  constructor(private firestore: AngularFirestore, private cdRef: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.updateFotoslindas();
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

      // Espera a que la foto se suba y luego actualiza las fotos
      await uploadBytes(storageRef, file).then(async (snapshot) => {
        console.log('Foto subida con éxito:', snapshot);
        await this.updateFotoslindas(); // Actualiza las fotos después de subir la nueva foto
      }).catch(error => {
        console.error('Error al subir la foto:', error);
      });
    }
  }

  async getFotoslindas(): Promise<string[]> {
    const storage = getStorage();
    const storageRef = ref(storage, 'fotos_lindas');

    try {
      const result = await listAll(storageRef);
      const downloadURLs = await Promise.all(
        result.items.map((item) => getDownloadURL(item))
      );
      console.log('URLs descargadas:', downloadURLs);
      return downloadURLs;
    } catch (error) {
      console.error('Error al obtener las fotos lindas:', error);
      return [];
    }
  }

  async updateFotoslindas() {
    this.fotosLindas = await this.getFotoslindas();
    console.log('Nuevas fotos lindas:', this.fotosLindas);
    this.cdRef.detectChanges(); // Asegúrate de que los cambios se detecten
  }
}
