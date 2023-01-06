import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../model/post.model';
import { PostsService } from '../service/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit,OnDestroy {
   posts: Post[] = []
   private postSub!: Subscription;

  constructor(public _postService:PostsService){}


  ngOnInit():void{
    this.posts = this._postService.getPost();

    this.postSub = this._postService.getPostUpdateListner().subscribe((post:Post[]) =>{
      this.posts = post;
    });
  }

  ngOnDestroy(){
    this.postSub.unsubscribe();
  }

}
