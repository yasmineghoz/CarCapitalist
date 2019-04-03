import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { World, Pallier, Product } from './world';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class RestserviceService {

  constructor(private http: HttpClient) { }

  server = 'http://localhost:8080/adventureisis/';

  user = localStorage.getItem('username');

  getUser() {
    return this.user;
  }

  setUser(user: string) {
    this.user = user;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  getWorld(): Promise<World> {
    return this.http.get(this.server + 'generic/world', {
      headers: this.setHeaders('test')
    })
      .toPromise()
      .catch(this.handleError);
  }

  private setHeaders(user: string): HttpHeaders {
    const headers = new HttpHeaders();
    headers.append('X-user', user);
    console.log(user);
    return headers;
  }
}
