import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guard/auth-guard.guard';
import { CosasLindasComponent } from './components/cosas-lindas/cosas-lindas.component';
import { CosasFeasComponent } from './components/cosas-feas/cosas-feas.component';
import { GraficosLindosComponent } from './components/graficos-lindos/graficos-lindos.component';
import { GraficosFeosComponent } from './components/graficos-feos/graficos-feos.component';
import { GraficosComponent } from './components/graficos/graficos.component';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  
  //normal loading

  { path: '',component: LoginComponent },
  { path: 'cosas-lindas', component: CosasLindasComponent, canActivate: [AuthGuard]  },
  { path: 'cosas-feas', component: CosasFeasComponent, canActivate: [AuthGuard]  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'graficos-lindos', component: GraficosLindosComponent },
  { path: 'graficos-feos', component: GraficosFeosComponent },
  { path: 'graficos', component: GraficosComponent },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
