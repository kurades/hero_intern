import { createFeatureSelector, createSelector } from '@ngrx/store';
import { User } from 'src/app/core/models/user';
import { Status } from '../interface/status';
export interface UserState {
  user: User | null;
  token: string;
  status: Status;
  error: string;
}

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => state.user
);

export const selectToken = createSelector(
  selectUserState,
  (state: UserState) => state.token
);
