import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {Map3DComponent} from './map3-d/map3-d.component';
import{JobComponent} from './job/job.component';
import {IpSettingComponent} from './ip-setting/ip-setting.component';
import { SaveMapComponent } from './save-map/save-map.component';
import {HomeComponent} from './home/home.component';
import {MapEditComponent}from './map-edit/map-edit.component';
import {LogoutComponent} from './logout/logout.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'map3-d',component:Map3DComponent},
  {path:'job',component:JobComponent},
  {path:'ipsetting',component:IpSettingComponent},
  {path:'save-map',component:SaveMapComponent},
  {path:'home',component:HomeComponent},
  {path:'map-edit',component:MapEditComponent},
  {path:'logout',component:LogoutComponent},
  {path:'home',component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
