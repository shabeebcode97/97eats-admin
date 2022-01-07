import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AppStateInterface } from './state';

const getters: GetterTree<AppStateInterface, StateInterface> = {
  user ( context ) {
    return context.user
  }
};

export default getters;
