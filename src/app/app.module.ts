import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http"
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { LeftNavComponent } from './left-nav/left-nav.component';
import { RightNavComponent } from './right-nav/right-nav.component';
import { Map3DComponent } from './map3-d/map3-d.component';
import { LoginComponent } from './login/login.component';
import { JobComponent } from './job/job.component';
import { IpSettingComponent } from './ip-setting/ip-setting.component';
import { SaveMapComponent } from './save-map/save-map.component';
import { HomeComponent } from './home/home.component';
import { MapEditComponent } from './map-edit/map-edit.component';
import { ImageDrawingModule } from 'ngx-image-drawing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LogoutComponent } from './logout/logout.component';


@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    LeftNavComponent,
    RightNavComponent,
    Map3DComponent,
    LoginComponent,
    JobComponent,
    IpSettingComponent,
    SaveMapComponent,
    HomeComponent,
    MapEditComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ImageDrawingModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
