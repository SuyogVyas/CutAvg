import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { Subscription } from 'rxjs';
import { AuthserviceService } from '../auth/authservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  constructor(private _authService:AuthserviceService){}

  private authListenerSubs:Subscription|undefined
  public userIsAuthenticated:boolean = false

  ngOnInit(){
    this.authListenerSubs = this._authService.getAuthStatusListener().subscribe(isAuthenticated=>{
      this.userIsAuthenticated = isAuthenticated
    })
  }


  ngOnDestroy(): void {
    this.authListenerSubs?.unsubscribe()
  }

  onLogout(){
    this._authService.logout()
  }

}
