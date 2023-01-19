import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';
import { PostcreateComponent } from './postcreate/postcreate.component';

const routes: Routes = [
  {path:"" , component:PostListComponent},
  {path:"create",component:PostcreateComponent},
  {path:"edit/:postId",component:PostcreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
