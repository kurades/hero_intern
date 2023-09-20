import { createReducer, on } from '@ngrx/store';
import * as UserAction from './user.actions';
import { UserState } from './user.selector';
import { Status } from '../interface/status';
export const initialState: UserState = {
  user: null,
  token: '',
  status: Status.pending,
  error: ''
};

export const UserReducer = createReducer(
  initialState,
  on(UserAction.loginSuccess, (state, { user, token }) => {
    return {
      ...state,
      user,
      token,
      status: Status.success
    };
  }),
  on(UserAction.loginFailure, (state, { error }) => ({
    ...state,
    status: Status.error,
    error
  })),
  on(UserAction.registerSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    status: Status.success
  })),
  on(UserAction.registerFailure, (state, { error }) => ({
    ...state,
    status: Status.error,
    error
  })),
  on(UserAction.profileSuccess, (state, { user }) => ({
    ...state,
    user,
    status: Status.success
  })),
  on(UserAction.profileFailure, (state, { error }) => ({
    ...state,
    status: Status.error,
    error
  }))
);
