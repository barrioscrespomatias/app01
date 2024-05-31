import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-graficos-lindos',
  templateUrl: './graficos-lindos.component.html',
  styleUrls: ['./graficos-lindos.component.scss'],
})
export class GraficosLindosComponent  implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  navigateTo(section: string) {
    this.navCtrl.navigateForward(`/${section}`);
  }

}
