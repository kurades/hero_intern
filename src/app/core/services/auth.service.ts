import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, of, tap } from 'rxjs';
import { MessageService } from './message.service';
import { User } from '../models/user';
import { AuthPayload } from '../models/authPayload';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'api/auth-manager';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor (
    private messageService: MessageService,
    private http: HttpClient,
    private cookieService: CookieService,
    private jwtHelper: JwtHelperService
  ) {}

  isAuthenticated (): boolean {
    const token = this.cookieService.get('token');
    if (!token) return false;
    return !this.jwtHelper.isTokenExpired(token);
  }

  log (message: string) {
    this.messageService.add(`AuthService:${message}`);
  }

  login (name: string, password: string): Observable<AuthPayload> {
    return this.http
      .post<AuthPayload>(`${this.authUrl}/login`, { name, password })
      .pipe(
        tap(() => {
          this.log('login success');
        }),
        catchError(this.handleError<AuthPayload>('login'))
      );
  }

  register (name: string, password: string): Observable<AuthPayload> {
    return this.http.post<AuthPayload>(
      `${this.authUrl}/register`,
      { name, password },
      this.httpOptions
    );
  }

  updateProfile (user: User): Observable<User> {
    return this.http.put<User>(`${this.authUrl}`, user, this.httpOptions).pipe(
      tap(() => {
        this.log('update profile user');
      }),
      catchError(this.handleError<User>('update profile'))
    );
  }

  loadAuthFromCookie () {
    const rawUser = this.cookieService.get('user');
    let user = null;
    let token = null;
    if (rawUser) {
      user = JSON.parse(rawUser);
      token = JSON.parse(this.cookieService.get('token'));
    }
    return { user, token };
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
