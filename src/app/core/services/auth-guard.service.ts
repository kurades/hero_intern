import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { HeroState } from '../store/Hero/hero.selector';
@Injectable()
export class AuthGuardService {
  constructor (
    public authService: AuthService,
    public router: Router,
    public store: Store<{ hero: HeroState }>
  ) {}

  canActivate (): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}
