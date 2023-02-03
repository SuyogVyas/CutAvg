import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthserviceService } from '../auth/authservice.service';
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
  private authStatusSub!:Subscription
  isLoading:boolean = false;
  userIsAuthenticated:boolean = false
  totalPosts = 0
  pageOptions = [1,3,5,10]
  currentPage = 1
  postsPerPage = 2

  constructor(public _postService: PostsService,private _authService:AuthserviceService) { }


  ngOnInit() {

    this.isLoading = true;
    this._postService.getPost(this.postsPerPage,this.currentPage)

    //subscribing the subject
    this.postSub = this._postService.getPostUpdateListner()
      .subscribe((postData:{posts:Post[],postCount:number}) => {
        this.isLoading = false
        this.totalPosts = postData.postCount
        this.posts = postData.posts

      });

    this.userIsAuthenticated = this._authService.getIsAuth()
    this.authStatusSub = this._authService.getAuthStatusListener().subscribe(isAuthenticated=>{
      this.userIsAuthenticated = isAuthenticated
    })

  }

  onChanged(pageData:PageEvent){

    this.isLoading = true;
    this.postsPerPage = pageData.pageSize
    this.currentPage = pageData.pageIndex + 1
    this._postService.getPost(this.postsPerPage,this.currentPage)

  }

  onDelete(postId:any)
  {
    this.isLoading = true
    this._postService.deletePost(postId).subscribe(()=>{
      this._postService.getPost(this.postsPerPage,this.currentPage)
    })
  }




  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
