import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  FIREBASE_URL = 'https://ng-complete-guide-15ad4-default-rtdb.firebaseio.com/';
  POSTS_URL = `${this.FIREBASE_URL}posts.json`;
  isFetching = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this._fetchPosts()
  }

  onCreatePost(postData: Post) {
    this.http.post<{name: string}>(this.POSTS_URL, postData)
      .subscribe(data => console.log(data));
  }

  onFetchPosts() {
  }

  onClearPosts() {
  }

  private _fetchPosts() {
    this.isFetching = true;
    this.http.get<{ [key: string]: Post }>(this.POSTS_URL)
      .pipe(map(resp => this._convertFireBaseRespToPosts(resp)))
      .subscribe(posts => {
        this.loadedPosts = posts;
        this.isFetching = false;
      });
  }

  private _convertFireBaseRespToPosts(resp: { [key: string]: Post }) {
    const postsArray: Post[] = [];
    for (const key in resp) {
      if (resp.hasOwnProperty(key)) {
        postsArray.push({ ...resp[key], id: key });
      }
    };
    return postsArray;
  }
}
