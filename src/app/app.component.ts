import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { UserState, selectUser } from './core/store/User/user.selector';
import { AuthService } from './core/services/auth.service';
import { loginSuccess } from './core/store/User/user.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Tour of hero';
  user$ = this.store.select(selectUser);

  constructor (
    private cookieService: CookieService,
    private authService: AuthService,
    private store: Store<{ user: UserState }>
  ) {}

  ngOnInit (): void {
    let payload = this.authService.loadAuthFromCookie();
    if (payload) this.store.dispatch(loginSuccess(payload));
  }

  logout () {
    this.cookieService.set('user', '');
    this.cookieService.set('token', '');
    window.location.reload();
  }
}
