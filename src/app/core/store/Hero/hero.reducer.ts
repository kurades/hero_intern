import { createReducer, on } from '@ngrx/store';
import {
  addHeroFailure,
  addHeroSuccess,
  addTagFailure,
  addTagSuccess,
  deleteHeroSuccess,
  deleteTagFailure,
  deleteTagSuccess,
  editHeroFailure,
  editHeroSuccess,
  editTagFailure,
  editTagSuccess,
  findHeroSuccess,
  getHeroesFailure,
  getHeroesSuccess,
  getTagsFailure,
  getTagsSuccess
} from './hero.actions';
import { HeroState } from './hero.selector';
import { Status } from '../interface/status';

export const initialState: HeroState = {
  heroes: [],
  error: '',
  tags: [],
  status: Status.idle
};
export const heroReducer = createReducer(
  initialState,
  on(addHeroSuccess, (state, { hero }) => ({
    ...state,
    heroes: [...state.heroes, hero]
  })),
  on(addHeroFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(getHeroesSuccess, (state, { heroes }) => ({
    ...state,
    heroes: heroes,
    status: Status.success
  })),
  on(getHeroesFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(findHeroSuccess, (state, { hero }) => ({
    ...state,
    heroes: hero,
    status: Status.success
  })),
  on(deleteHeroSuccess, (state, { hero }) => {
    console.log(hero);

    return {
      ...state,
      heroes: state.heroes.filter(h => h._id !== hero._id),
      status: Status.success
    };
  }),
  on(editHeroSuccess, (state, { hero }) => {
    const heroIndex = state.heroes.findIndex(h => h._id === hero._id);
    const newHeroes = [...state.heroes];
    newHeroes[heroIndex] = hero;
    return {
      ...state,
      heroes: newHeroes,
      status: Status.success
    };
  }),
  on(editHeroFailure, (state, { error }) => {
    return {
      ...state,
      error
    };
  }),
  on(getTagsSuccess, (state, { tags }) => {
    return {
      ...state,
      tags,
      status: Status.success
    };
  }),
  on(getTagsFailure, (state, { error }) => {
    return {
      ...state,
      error
    };
  }),
  on(addTagSuccess, (state, { tag }) => {
    console.log([...state.tags, tag]);

    return {
      ...state,
      tags: [...state.tags, tag],
      status: Status.success
    };
  }),
  on(addTagFailure, (state, { error }) => {
    return {
      ...state,
      error
    };
  }),
  on(editTagSuccess, (state, { tag }) => {
    const tagIndex = state.tags.findIndex(t => t._id === tag._id);
    console.log(tagIndex);

    const newTags = [...state.tags];
    newTags[tagIndex] = tag;
    return {
      ...state,
      tags: newTags,
      status: Status.success
    };
  }),
  on(editTagFailure, (state, { error }) => {
    return {
      ...state,
      error
    };
  }),
  on(deleteTagSuccess, (state, { tag }) => {
    const newTags = state.tags.filter(t => t._id !== tag._id);

    return {
      ...state,
      tags: newTags,
      status: Status.success
    };
  }),
  on(deleteTagFailure, (state, { error }) => {
    return {
      ...state,
      error
    };
  })
);
