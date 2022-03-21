import StoreBase from './store-base';

export interface StoreState {
}

export class Store extends StoreBase<StoreState> {
  constructor() {
    super({
    });
  }
}

export const store = new Store();