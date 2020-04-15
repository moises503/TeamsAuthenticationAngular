import { Injectable } from '@angular/core';
import * as hello from "hellojs";
import fetch from 'node-fetch';

var that: HellojsauthService;


@Injectable()
export class HellojsauthService {

  private clientId: string = "d73fd05d-4e1e-4332-9c5c-3eaaaed350e4";
  private upn: string = "";
  public isAuthenticated: boolean = false;

  constructor() {
    that = this;

    hello.init({
      graph: {
        name: 'graph',
        oauth: {
          version: 2,
          auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
        },
        scope_delim: ' ',
        scope: { teams: 'user.read, tasks.read, calendars.read, files.read.all, mail.read, user.readbasic.all' },
        refresh: true,
        login: (p: any) => {

          let upn = localStorage.getItem('upn');

          if (upn != undefined)
            p.qs.login_hint = upn;
        }
      }
    });

    hello.init({
      graph: this.clientId
    }, {
        display: 'page',
        redirect_uri: '/auth',
        scope: 'teams',

      });

    hello.on('auth.expired', this.onExpired);
    hello.on('auth.login', this.onLogin);
    hello.on('auth.update', this.onUpdate);

    microsoftTeams.initialize();

    this.checkState();
  }


  public setUpn(upn: string) {
    // getting the upn when HelloJs will launch login, will be called from another context
    // so we are using the localstorage to be able to retrieve the upn value
    localStorage.setItem('upn', upn);
  }

  private onExpired(auth: hello.HelloJSEventArgument) {
    console.log('has expired from network ' + auth.network);
    that.checkState();
  }

  private onLogin(auth: hello.HelloJSEventArgument) {
    console.log('has login on netwtork ' + auth.network);
    that.checkState();
  }

  private onLogout(auth: hello.HelloJSEventArgument) {
    console.log('has logout from netwtork ' + auth.network);
    that.checkState();
  }

  private onUpdate(auth: hello.HelloJSEventArgument) {
    console.log('has update on ' + auth.network);
    that.checkState();
  }

  resolveLogin: (value: string | any) => void;
  resolveToken: (value: string | any) => void;
  rejectLogin: (reason?: any) => void;
  rejectToken: (reason?: any) => void;

  public tryGetAccessTokenAsync(): Promise<string> {

    return new Promise<string>((rs, rj) => {
      try {

        if (this.isAuthenticated) {
          return rs(this.getAccessToken());
        }

        this.resolveToken = rs;
        this.rejectToken = rj;

        this.checkState();

      } catch (error) {

        this.resolveToken = undefined;
        this.rejectToken = undefined;
        rj(error);
      }
    })

  }


  public async tryLoginSilentlyAsync(): Promise<string> {
    return new Promise<string>((rs, rj) => {

      try {

        if (this.isAuthenticated)
          return rs(this.getAccessToken());

        this.resolveLogin = rs;
        this.rejectLogin = rj;

        hello('graph').login({ display: 'none' });

      } catch (error) {
        this.resolveLogin = undefined;
        this.rejectLogin = undefined;
        rj(error);
      }

    });
  }

  public async tryLoginAsync(username?: string): Promise<string> {

    return new Promise<string>((rs, rj) => {

      try {

        if (this.isAuthenticated)
          return rs(this.getAccessToken());

        this.resolveLogin = rs;
        this.rejectLogin = rj;

        hello('graph').login();

      } catch (error) {

        this.resolveLogin = undefined;
        this.rejectLogin = undefined;
        rj(error);
      }
    });
  }

  public async tryLogoutAsync(): Promise<any> {
    try {
      await hello('graph').logout();
    } catch (error) {

    }
    this.checkState();
  }


  checkState() {

    let session = hello.utils.store('graph');

    if (session) {

      let currentTime = ((new Date()).getTime() / 1e3);

      // set if is authenticated
      this.isAuthenticated = session.expires && session.access_token && session.expires > currentTime;
    }
    else {
      this.isAuthenticated = false;
    }

    if (this.isAuthenticated) {
      if (this.resolveLogin) {
        // alert('calling resolve');
        this.resolveLogin(this.getAccessToken());
      }
      if (this.resolveToken) this.resolveToken(this.getAccessToken());
    }
    else {
      if (this.rejectLogin) this.rejectLogin('expired');
      if (this.rejectToken) this.rejectToken('expired');
    }


  }



  public popupAuthenticationAsync(): Promise<string> {


    return new Promise((rs, rj) => {

      microsoftTeams.authentication.authenticate({
        url: "/auth",
        width: 1024,
        height: 768,
        failureCallback: exception => {
          console.log('failure with ex ' + exception);
          rj(exception);
        },
        successCallback: message => {
          console.log('success with message ' + message);
          rs(message);
        }
      });
    });

  }

  private getAccessToken(): string | undefined {

    if (!this.isAuthenticated)
      return undefined;

    let session = hello.utils.store('graph');

    if (session && session.access_token)
      return session.access_token;

    return undefined;
  }



  private getAccessTokenFromResponse(): string | undefined {

    var authRes = hello('graph').getAuthResponse();

    if (authRes && authRes.access_token)
      return authRes.access_token;

    return undefined;

  }


  public notifySuccess() {
    try {
      // microsoftTeams.initialize();
      microsoftTeams.authentication.notifySuccess('success');
    }
    catch (e) {
      console.log('notify success failed : ' + e);
    }
  }

  public notifyFailure(msg: string) {
    try {
      // microsoftTeams.initialize();
      msg = msg ? msg : "not able to authenticate the user";
      microsoftTeams.authentication.notifyFailure(msg);
    }
    catch (e) {
      console.log('notify failure failed : ' + e);
    }
  }


  // logout() {
  //   hello('msft').logout().then(
  //     () => this.router.navigate(['/']),
  //     e => console.error(e.error.message)
  //   );
  // }

}
