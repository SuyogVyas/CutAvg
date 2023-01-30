import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from '../mime-type.validator'
import { Post } from '../model/post.model';
import { PostsService } from '../service/post.service';

@Component({
  selector: 'app-postcreate',
  templateUrl: './postcreate.component.html',
  styleUrls: ['./postcreate.component.css']
})
export class PostcreateComponent implements OnInit {
  enteredContent = ''
  enteredTitle = ''
  private mode = 'create'
  private postId: any
  form!: FormGroup;
  public post: any
  imagePreview?: string
  isLoading: boolean = false;

  constructor(public _postService: PostsService, private _route: ActivatedRoute) { }

  ngOnInit() {

    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    })



    this._route.paramMap.subscribe((paramMap: ParamMap) => {

      //if the route has id that means we are editing the post
      if (paramMap.has('postId')) {

        this.mode = 'edit'
        this.postId = paramMap.get('postId');
        console.log(this.postId)
        this.isLoading = true;
        this._postService.getPostById(this.postId).subscribe((data) => {

          this.isLoading = false;
          console.log(data.imagePath)
          this.post = { id: data._id, title: data.title, content: data.content, imagePath: data.imagePath }

          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          })
        })
      }
      //if route doesnot have any id that means we are creating the post for the first time
      else {
        this.mode = 'create'
        this.postId = null
      }
    })
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.item(0)
    this.form.patchValue({ image: file }) // patchvalue use to set the value of any field in form,,,,setvalue sets for all
    this.form.get('image')?.updateValueAndValidity() //check for the value and also update it in form
    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result as string
    }
    reader.readAsDataURL(file as Blob)
  }

  onSavePost() {

    if (this.form.invalid) {
      return;
    }

    this.isLoading = true
    if (this.mode == "create") {
      this._postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image)
    }
    else {
      console.log("inside edit save " + this.form.value.image)
      this._postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image)
    }


    this.form.reset()

  }
}
