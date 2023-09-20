import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Hero } from 'src/app/core/models/hero';
import { Tag } from '../../models/tag';
import { Status } from '../interface/status';
export interface HeroState {
  heroes: Hero[];
  error: string;
  tags: Tag[];
  status: Status;
}

export const selectHeroState = createFeatureSelector<HeroState>('heroes');

export const selectHeros = createSelector(
  selectHeroState,
  (state: HeroState) => state.heroes
);

export const selectTags = createSelector(
  selectHeroState,
  (state: HeroState) => state.tags
);
