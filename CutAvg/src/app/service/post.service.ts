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

  constructor(private http: HttpClient, private _router: Router) { }

  getPost() {

    //return this.http.get<any>("http://localhost:3000/api/posts")

    return this.http.get<any>("http://localhost:3000/api/posts")
      .pipe(map((postData) => {
        return postData.post.map((pos: any) => {
          return {
            title: pos.title,
            content: pos.content,
            id: pos._id,
            imagePath: pos.imagePath
          }
          console.log("getpost ",pos.imagePath)
        })
      }))
      .subscribe(
        (transformedPosts) => {
          this.posts = transformedPosts

          this.postUpdated.next([...this.posts]);
        });

    //return [...this.posts] //[...this.posts] is the syntax to pass the copy of array/// this.post passes reference
  }

  getPostUpdateListner() {
    return this.postUpdated.asObservable()
  }

  addPost(title: string, content: string, image: File) {

    // with this syntax we cannot pass images/files
    //const post: Post = { id: '', title: title, content: content }

    //we cannot pass files with json so we use formdata
    const postData = new FormData()
    postData.append("title", title)
    postData.append("content", content)
    postData.append("image", image)
    return this.http.post<any>("http://localhost:3000/api/posts", postData).subscribe(responseData => {

      const post: Post = { id: responseData.postId, title: responseData.title, content: responseData.content, imagePath: responseData.imagePath }
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this._router.navigate(["/"]);
    })

    //  this.postUpdated.next([...this.posts]);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData:any = ""
    console.log("id "+id)
    console.log("title "+title)
    console.log("content "+content)
    console.log("image "+image)
    //here can be two scenarios
    //user has changed image or image is same
    //if image is same then the same string will be passed
    //if image is changed then the file is passed which is an object,so we need to create postdata
    //because we cannot pass file/image through json for that we use formdata
    if (typeof (image) == 'object') {
      postData = new FormData()
      postData.append("id",id)
      postData.append("title", title)
      postData.append("content", content)
      postData.append("image", image)
    }
    else {
      postData = { id: id, title: title, content: content, imagePath: image }
    }

    console.log(postData)
    this.http.put("http://localhost:3000/api/posts/" + id, postData).subscribe((res) => {
      console.log("Updated")
      const updatedPosts = [...this.posts]
      const oldPostIndex = updatedPosts.findIndex(p => p.id  === id)
      const post:Post = {
        id:id,
        title:title,
        content:content,
        imagePath:image
      }
      updatedPosts[oldPostIndex]  = post
      this.posts = updatedPosts
      this.postUpdated.next([...this.posts])
      this._router.navigate(["/"]);
    })

  }

  getPostById(postId: string) {
    console.log(postId)
    return this.http.get<any>("http://localhost:3000/api/posts/" + postId);
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
