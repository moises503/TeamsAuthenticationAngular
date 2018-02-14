import { Component, OnInit } from '@angular/core';
import { HellojsauthService } from '../services/hellojsauth.service';

@Component({
  selector: 'app-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.css']
})
export class RemoveComponent implements OnInit {


  constructor(private authService: HellojsauthService) {
  }


  async ngOnInit() {
    await this.authService.tryLogoutAsync();
  }


}
