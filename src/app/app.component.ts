import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from './post.model';
import { PostsService } from './posts.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;

  private errorSub: Subscription;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.onFetchPosts();
    this.errorSub = this.postsService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    })
  }

  onCreatePost(postData: Post) {
    this.postsService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    this.postsService.fetchPosts().subscribe(
      posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
      }, error => {
        this.isFetching = false;
        this.error = error.message;
    });
  }

  onClearPosts() {
    this.postsService.deletePosts().subscribe(_ => {
      this.loadedPosts = [];
    })
  }

  onHandleError() {
    this.error = null;
    this.onFetchPosts();
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }
}
