import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Post } from '../model/post.model';
import { PostsService } from '../service/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  public posts: Post[] = []
  private postSub!: Subscription;
  isLoading:boolean = false;
  totalPosts = 10
  pageOptions = [1,3,5,10]
  postsPerPage = 2

  constructor(public _postService: PostsService) { }


  ngOnInit() {

    this.isLoading = true;
    this._postService.getPost()
    this.postSub = this._postService.getPostUpdateListner()
      .subscribe((post: any) => {
        this.isLoading = false
        this.posts = post

      });
  }

  onChanged(pageData:PageEvent){
    console.log(pageData)
  }

  onDelete(postId:any)
  {
    console.log(postId)
    this._postService.deletePost(postId)
  }




  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

}
