import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // constructor(public router: Router) {}

  ngOnInit() {}

  // RedirigirCosasLindas() {
  //   this.router.navigate(['/cosas-lindas']);
  // }

  // RedirigirCosasFeas() {
  //   this.router.navigate(['/cosas-feas']);
  // }

  constructor(private navCtrl: NavController) {}

  navigateTo(section: string) {
    this.navCtrl.navigateForward(`/${section}`);
  }
}
