import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  constructor(private _authService:AuthserviceService){}
  isLoading:boolean = false

  onSignup(form:NgForm){
    if(form.invalid)
    {
      return
    }

    this._authService.createUser(form.value.email,form.value.password)
  }
}
