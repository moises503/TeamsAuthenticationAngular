import { Component, OnInit } from '@angular/core';
import { HellojsauthService } from "../services/hellojsauth.service";
import { GraphService } from '../services/graph.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  locale: string;
  subEntityId: string;
  teamId: string;
  tid: string;
  upn: string;
  groupId: string;
  entityId: string;
  members: Array<any>;
  constructor(public authService: HellojsauthService, private graphService: GraphService) { }

  channelId: string;
  callbackReason: string;
  authentication: string;
  user: any;

  async logout() {
    try {
      await this.authService.tryLogoutAsync();
      this.authentication = "";
      this.user = null;
    } catch (error) {
      console.log(error);
    }
  }


  async authenticateSilently() {

    try {

      await this.authService.tryLoginSilentlyAsync();

      let token = await this.authService.tryGetAccessTokenAsync();

      if (token != undefined)
        this.authentication = token;

    } catch (error) {
      console.log('home error');
      console.log(error);
    }
  }

  async authenticate() {

    try {

      await this.authService.popupAuthenticationAsync();

      let token = await this.authService.tryGetAccessTokenAsync();

      if (token != undefined)
        this.authentication = token;

    } catch (error) {
      console.log('home error');
      console.log(error);
    }

  }

  async getGroup() {

    if (this.authService.isAuthenticated && this.groupId != undefined) {

      let group = await this.graphService.getGroupMembersAsync(this.groupId);

      if (group) {
        alert(group);
        this.members = <any>group[0];
      }

    }
  }

  async getUser() {
    if (this.authService.isAuthenticated) {

      let user = await this.graphService.getUserAsync();

      if (user) {
        //alert(user);
        this.user = user
      }

    }
  }

  async ngOnInit() {

    microsoftTeams.initialize();

    microsoftTeams.getContext((c) => {

      this.channelId = c.channelId;
      this.entityId = c.entityId;
      this.groupId = c.groupId;
      this.locale = c.locale;
      this.subEntityId = c.subEntityId;
      this.teamId = c.teamId;
      this.tid = c.tid;
      this.upn = c.upn;

      if (this.upn != undefined) {
        this.authService.setUpn(this.upn);
      }

    });



  }

}


