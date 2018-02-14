import { Component, OnInit, OnDestroy } from '@angular/core';
import { HellojsauthService } from '../services/hellojsauth.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  btnClass: string;
  upn: string;

  ngOnDestroy(): void {

  }


  constructor(private authService: HellojsauthService) {
  }

  async ngOnInit() {

    try {
      microsoftTeams.initialize();

      let token = await this.authService.tryGetAccessTokenAsync();

      if (token) {
        this.authService.notifySuccess();
      }

    } catch (error) {
    }

  }

  async authenticateAsync() {

    if (this.authService.isAuthenticated) {
      return this.authService.notifySuccess();
    }

    try {
      await this.authService.tryLoginAsync(this.upn);
    } catch (error) {
      this.authService.notifyFailure(error);
    }
  }






}
