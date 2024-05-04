import { Component, OnInit } from '@angular/core';
import { FotosFeasService } from 'src/app/services/fotos-feas.service';

@Component({
  selector: 'app-cosas-feas',
  templateUrl: './cosas-feas.component.html',
  styleUrls: ['./cosas-feas.component.scss'],
})
export class CosasFeasComponent  implements OnInit {

  fotosFeas: any;
  photoService : FotosFeasService;

  constructor(photoService: FotosFeasService) {
    this.photoService = photoService;
  }

 async ngOnInit() {
    this.photoService.addNewToGallery();
    await this.photoService.loadSaved();
  }
}
