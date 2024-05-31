import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment.development';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ToastComponent } from './components/toast/toast.component';
import { CosasLindasComponent } from './components/cosas-lindas/cosas-lindas.component';
import { CosasFeasComponent } from './components/cosas-feas/cosas-feas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card'; 
import { GraficosComponent } from './components/graficos/graficos.component';
import { ChartComponent } from './components/chart/chart.component';
import { NgChartjsModule } from 'ng-chartjs';
import { GraficosLindosComponent } from './components/graficos-lindos/graficos-lindos.component';
import { GraficosFeosComponent } from './components/graficos-feos/graficos-feos.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginComponent,
    HomeComponent,
    ToastComponent,
    CosasFeasComponent,
    CosasLindasComponent,
    GraficosComponent,
    ChartComponent,
    GraficosLindosComponent,
    GraficosFeosComponent

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    NgChartjsModule,
  ],
  exports: [
    MenuComponent,
    LoginComponent,
    HomeComponent,
    ToastComponent,
    GraficosLindosComponent,
    GraficosFeosComponent,
    GraficosComponent
    // Agrega el componente en la sección de exports
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment }],
  bootstrap: [AppComponent],
})
export class AppModule {}
