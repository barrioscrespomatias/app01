import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserPhoto } from 'src/app/interfaces/userPhoto';
import { FileService } from 'src/app/services/file.service';
import {decode} from "base64-arraybuffer";
import * as moment from 'moment';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

@Component({
  selector: 'app-cosas-lindas',
  templateUrl: './cosas-lindas.component.html',
  styleUrls: ['./cosas-lindas.component.scss'],
})
export class CosasLindasComponent implements OnInit {
  public photos: UserPhoto[] = [];
  fileService : FileService;


  constructor(fileService : FileService) {
    this.fileService = fileService;
  }

  async ngOnInit() {
    this.CapturarImagen();
  }

  async CapturarImagen(){

  const cameraPhoto  = await Camera.getPhoto({
    resultType: CameraResultType.Base64, // file-based data; provides best performance
    source: CameraSource.Camera, // automatically take a new photo with the camera
    quality: 100, // highest quality (0 to 100)
    promptLabelHeader: 'linda'
  });

  if(cameraPhoto .base64String != undefined){
      const blob = new Blob([new Uint8Array(decode(cameraPhoto.base64String))], {
        type: `image/${cameraPhoto.format}`,
      });
    
      const file = new File([blob], "linda", {
          lastModified: moment().unix(),
          type: blob.type,
      });
      const storage = getStorage();
      const storageRef = ref(storage, "nuevaFoto");

      uploadBytes(storageRef, file).then((snapshot) => {
      
    });
    }
  }
}