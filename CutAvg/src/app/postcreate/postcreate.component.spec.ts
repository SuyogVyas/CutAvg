import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostcreateComponent } from './postcreate.component';

describe('PostcreateComponent', () => {
  let component: PostcreateComponent;
  let fixture: ComponentFixture<PostcreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostcreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
