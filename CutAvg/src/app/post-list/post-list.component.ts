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
  totalPosts = 0
  pageOptions = [1,3,5,10]
  currentPage = 1
  postsPerPage = 2

  constructor(public _postService: PostsService) { }


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
  }

  onChanged(pageData:PageEvent){

    this.isLoading = true;
    this.postsPerPage = pageData.pageSize
    this.currentPage = pageData.pageIndex + 1
    this._postService.getPost(this.postsPerPage,this.currentPage)
    console.log(pageData)
  }

  onDelete(postId:any)
  {
    console.log(postId)
    this._postService.deletePost(postId).subscribe(()=>{
      this._postService.getPost(this.postsPerPage,this.currentPage)
    })
  }




  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

}
