import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { AuthData } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private _http:HttpClient,private _router:Router) { }

  private token:string = ""
  private isAuthenticated:boolean = false
  private authStatusListener = new Subject<boolean>()

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable()
  }

  createUser(email:string,password:string){
    const authData:AuthData = {email:email,password:password}

    this._http.post("http://localhost:3000/api/user/signup",authData)
    .subscribe(response=>{
      console.log(response)
    })
  }

  login(email:string,password:string){
    const authData:AuthData = {email:email,password:password}

    this._http.post<any>("http://localhost:3000/api/user/login",authData)
    .subscribe(response=>{
      const token = response.token
      this.token = token
      if(token){
        this.isAuthenticated = true
        this.authStatusListener.next(true)
        this._router.navigate(['/'])
      }
    })
  }

  logout(){
    this.token = ""
    this.isAuthenticated = false
    this.authStatusListener.next(false)
    this._router.navigate(['/'])
  }
}
