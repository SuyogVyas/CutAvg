import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private _authService:AuthserviceService){}

  isLoading:boolean = false

  onLoginForm(form:NgForm){
    if(form.invalid){
      return
    }
    this._authService.login(form.value.email,form.value.password)
  }
}
