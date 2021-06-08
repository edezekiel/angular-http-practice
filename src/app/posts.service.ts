import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  FIREBASE_URL = 'https://ng-complete-guide-15ad4-default-rtdb.firebaseio.com/';
  POSTS_URL = `${this.FIREBASE_URL}posts.json`;

  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title, content };

    this.http.post<{name: string}>(this.POSTS_URL, postData).subscribe(
      data => {
        console.log(data)
      }, error => {
        this.error.next(error.message);
      }
    );
  }

  deletePosts() {
    return this.http.delete(`${this.POSTS_URL}`);
  }

  fetchPosts() {
    return this.http.get<{ [key: string]: Post }>(this.POSTS_URL)
      .pipe(
        map(resp => this._convertFireBaseRespToPosts(resp)),
        catchError(error => throwError(error))
      );
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