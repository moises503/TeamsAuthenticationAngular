import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseRequestOptions, Headers, RequestOptions } from "@angular/http";
import { AppComponent } from './app.component';
import { ConfigComponent } from './config/config.component';
import { HomeComponent } from './home/home.component';
import { RemoveComponent } from './remove/remove.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsofuseComponent } from './termsofuse/termsofuse.component';
import { AuthComponent } from './auth/auth.component';
import { HellojsauthService } from './services/hellojsauth.service'
import { GraphService } from "./services/graph.service";

import { HttpClientModule } from '@angular/common/http';


var routes: Routes = [
  { path: "", component: AppComponent },
  { path: "config", component: ConfigComponent },
  { path: "home", component: HomeComponent },
  { path: "privacy", component: PrivacyComponent },
  { path: "auth", component: AuthComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
    HomeComponent,
    RemoveComponent,
    PrivacyComponent,
    TermsofuseComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [HellojsauthService, GraphService],
  bootstrap: [AppComponent]
})
export class AppModule { }
