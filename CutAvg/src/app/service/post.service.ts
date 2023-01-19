import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { response, } from "express";
import { map, Observable, Subject } from "rxjs";
import { Post } from "../model/post.model";

@Injectable({ providedIn: 'root' })
export class PostsService {

  posts: Post[] = []
  private postUpdated = new Subject<Post[]>(); //Subject emits value subscribe it to listen changes

  constructor(private http: HttpClient,private _router:Router) { }

  getPost() {

    //return this.http.get<any>("http://localhost:3000/api/posts")

    return this.http.get<any>("http://localhost:3000/api/posts")
      .pipe(map((postData) => {
        return postData.post.map((pos: any) => {
          return {
            title: pos.title,
            content: pos.content,
            id: pos._id
          }
        })
      }))
      .subscribe(
        (transformedPosts) => {
          this.posts = transformedPosts
          console.log(transformedPosts)
          this.postUpdated.next([...this.posts]);
        });

    //return [...this.posts] //[...this.posts] is the syntax to pass the copy of array/// this.post passes reference
  }



  getPostUpdateListner() {
    return this.postUpdated.asObservable()
  }

  addPost(title: string, content: string) {
    const post: Post = { id: '', title: title, content: content }

    return this.http.post<any>("http://localhost:3000/api/posts", post).subscribe(responseData => {

      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this._router.navigate(["/"]);
    })

    //  this.postUpdated.next([...this.posts]);
  }

  updatePost(id:string,title:string,content:string){
    const post = {id:id,title:title,content:content}
    this.http.put("http://localhost:3000/api/posts/"+id,post).subscribe(()=>{
      console.log("Updated")
      this._router.navigate(["/"]);
    })

  }

  getPostById(postId:string){
    console.log(postId)
    return this.http.get<any>("http://localhost:3000/api/posts/"+postId);
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);

      });
  }

}
