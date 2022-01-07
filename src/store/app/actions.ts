import { api } from 'src/boot/axios';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AppStateInterface, UserInterface } from './state';
import { LocalStorage } from 'quasar'

const actions: ActionTree<AppStateInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  },
  init (context) {
    return new Promise((resolve, reject) => {
      if(process.env.DEV && process.env.TOKEN) {
        const token = LocalStorage.getItem('token');
        if(token) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          api.defaults.headers.common['Authorization'] = 'Bearer ' + token.toString()
          api.get('/user').then((res: {data: UserInterface | null}) => {
            if (res.data) {
              context.commit('app/setUser',res.data, { root: true })
              resolve('authenticated');
            } else {
              LocalStorage.remove('token');
              reject('unauthenticated');
            }
          }).catch(() => {
            LocalStorage.remove('token');
            reject('unauthenticated');
          })
        } else {
          reject('unauthenticated');
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        api.get(context.state.baseURL + '/sanctum/csrf-cookie').then(() => {
          api.get('/user').then((res: {data: UserInterface | null}) => {
            if (res.data) {
              context.commit('app/setUser',res.data, { root: true })
              resolve('authenticated');
            } else {
              reject('unauthenticated');
            }
          }).catch(() => {
            reject('unauthenticated');
          })
        }).catch(() => {
          // console.log(err.response);
          reject('unauthenticated');
        })
      }
    })
  }
};

export default actions;
