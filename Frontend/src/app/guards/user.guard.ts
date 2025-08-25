import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorage } from '../auth/token.storage';

export const userGuard: CanActivateFn = () => {
  const tokens = inject(TokenStorage);
  const router = inject(Router);
  const user = tokens.getUser<any>();
  if (tokens.getToken() && user && (user.role === 'user' || user.role === 'admin')) {
    return true;
  }
  router.navigateByUrl('/auth');
  return false;
};
