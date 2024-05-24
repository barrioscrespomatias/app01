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
} from 'firebase/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-cosas-feas',
  templateUrl: './cosas-feas.component.html',
  styleUrls: ['./cosas-feas.component.scss'],
})
export class CosasFeasComponent implements OnInit {
  assetBasePath: string = 'assets/images/home/malo.jpg';
  alt: string = 'cosas-feas';
  fotosFeas: string[] = [];

  constructor(private firestore: AngularFirestore, private cdRef: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.updateFotosFeas();
  }

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

      // Espera a que la foto se suba y luego actualiza las fotos
      await uploadBytes(storageRef, file).then(async (snapshot) => {
        console.log('Foto subida con éxito:', snapshot);
        await this.updateFotosFeas(); // Actualiza las fotos después de subir la nueva foto
      }).catch(error => {
        console.error('Error al subir la foto:', error);
      });
    }
  }

  async getFotosFeas(): Promise<string[]> {
    const storage = getStorage();
    const storageRef = ref(storage, 'fotos_feas');

    try {
      const result = await listAll(storageRef);
      const downloadURLs = await Promise.all(
        result.items.map((item) => getDownloadURL(item))
      );
      console.log('URLs descargadas:', downloadURLs);
      return downloadURLs;
    } catch (error) {
      console.error('Error al obtener las fotos feas:', error);
      return [];
    }
  }

  async updateFotosFeas() {
    this.fotosFeas = await this.getFotosFeas();
    console.log('Nuevas fotos feas:', this.fotosFeas);
    this.cdRef.detectChanges(); // Asegúrate de que los cambios se detecten
  }
}
