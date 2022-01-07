import { MutationTree } from 'vuex';
import { AppStateInterface, LanguagesInterface, UserInterface } from './state';

const mutation: MutationTree<AppStateInterface> = {
  setUser ( state: AppStateInterface, data: UserInterface) {
    state.user = {
      id: data.id,
      name: data.name,
      email: data.email
    }
  },
  setLanguages (state: AppStateInterface, data: LanguagesInterface[]) {
    state.languages = data
  }
};

export default mutation;
