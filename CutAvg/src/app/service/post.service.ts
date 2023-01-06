import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "../model/post.model";

@Injectable({providedIn:'root'})
export class PostsService{

  private posts:Post[] = []
  private postUpdated = new Subject<Post[]>(); //Subject emits value subscribe it to listen changes

  getPost(){
    return [...this.posts] //[...this.posts] is the syntax to pass the copy of array/// this.post passes reference
  }

  getPostUpdateListner(){
    return this.postUpdated.asObservable()
  }

  addPost(title:string , content:string){
    const post:Post = {title:title,content:content}
    this.posts.push(post)
    this.postUpdated.next([...this.posts]);

  }

}
