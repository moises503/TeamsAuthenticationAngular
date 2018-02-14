import { Component, OnInit } from '@angular/core';
import { HellojsauthService } from '../services/hellojsauth.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  constructor(private hello: HellojsauthService) { }

  async ngOnInit() {

    var access_token1 = await this.hello.tryGetAccessTokenAsync();

  }

}
