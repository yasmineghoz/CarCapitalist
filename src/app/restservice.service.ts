import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { World, Pallier, Product } from './world';

@Injectable()
export class RestserviceService {

  constructor(private http: HttpClient) { }

  server = 'http://localhost:8080/adventureisis/';

  // tslint:disable-next-line:variable-name
  _user = '';

  get user() {
    return this._user;
  }

  set user(user) {
    this._user = user;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  getWorld(): Promise<World> {
    return this.http.get(this.server + 'generic/world', {
      headers: this.setHeaders(this.user)
    })
      .toPromise()
      .catch(this.handleError);
  }

  private setHeaders(user: string): Headers {
    const headers = new Headers();
    headers.append('X-User', user);
    return headers;
  }
}
