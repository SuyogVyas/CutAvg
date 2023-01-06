import { Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../model/post.model';
import { PostsService } from '../service/post.service';

@Component({
  selector: 'app-postcreate',
  templateUrl: './postcreate.component.html',
  styleUrls: ['./postcreate.component.css']
})
export class PostcreateComponent {
  enteredContent = ''
  enteredTitle = ''

  constructor(public _postService:PostsService){}

  addPostOnClick(form:NgForm){

    if(form.invalid){
      return;
    }

    this._postService.addPost(form.value.title,form.value.content)
    form.resetForm();

  }
}
