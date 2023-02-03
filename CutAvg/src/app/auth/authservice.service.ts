import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private _http:HttpClient) { }

  createUser(email:string,password:string){
    const authData:AuthData = {email:email,password:password}

    this._http.post("http://localhost:3000/api/user/signup",authData)
    .subscribe(response=>{
      console.log(response)
    })
  }

  login(email:string,password:string){
    const authData:AuthData = {email:email,password:password}

    this._http.post("http://localhost:3000/api/user/login",authData)
    .subscribe(response=>{
      console.log(response)
    })
  }
}
