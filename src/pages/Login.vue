<template>
  <div class="column justify-center items-center window-height" v-if="!appLoading">
    <div class="row">
      <div class="col">
        <img src="~assets/img/nseats_logo.png"/>
      </div>
    </div>
    <q-card style="width:500px; max-width:90%">
      <q-card-section class="bg-yellow-7 text-bold text-grey-9">
        <div class="text-h6 text-bold text-center">Admin Login</div>
      </q-card-section>
      <q-separator/>
      <q-card-section>  
        <q-form ref="loginform">
          <div class="row">
            <div class="col">
              <q-input label="Email" filled v-model="model.email" :rules="[v => !!v || 'Required']"  @keyup.enter="loginFn">
                <template v-slot:prepend>
                  <q-icon name="mail" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input label="Password" :type="isVisiblePassword ? 'text' : 'password'" filled v-model="model.password" :rules="[v => !!v || 'Required']" @keyup.enter="loginFn">
                <template v-slot:prepend>
                  <q-icon name="lock"/>
                </template>
                <template v-slot:append>
                  <q-btn :icon="isVisiblePassword ? 'visibility_off' : 'visibility'" @click="isVisiblePassword = !isVisiblePassword" flat round/>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-checkbox label="Remember me?" v-model="model.remember" color="yellow-8"/>
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-separator spaced/>
      <q-card-actions>
        <q-btn class="full-width" color="yellow-7" text-color="black" label="Login" @click="loginFn"/>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { LocalStorage, QForm, useQuasar } from 'quasar'
import { useStore } from 'src/store'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { AxiosResponse } from 'axios'
interface CustomAxiosResponse extends AxiosResponse {
  data: {
    message: string
  }
}
interface CustomAxiosError {
  response: {
    status: number,
    data: {
      message: string,
      errors: {
        [key: string]: string
      }
    }
  }
}
export default defineComponent({
  setup() {
    const $q = useQuasar()
    const $store = useStore();
    const $router = useRouter();
    const model = ref({
      email: null,
      password: null,
      scope: 'admin',
      remember: false,
      device_name: 'android'
    });

    const loginform = ref<QForm>();
    const isVisiblePassword = ref(false);

    const loginFn = () => {
      loginform.value?.validate().then((success:boolean) => {
        if (success) {
          $q.loading.show();
          if (process.env.DEV && process.env.TOKEN) {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            api.post(process.env.BASEURL + '/sanctum/token', model.value).then((res) => {
              LocalStorage.set('token',res.data)
              $router.push('/').catch((err) => console.log(err));
            }).catch((err:CustomAxiosError) => {
              console.log(err.response);
              if (err.response.status === 422) {
                $q.notify({
                  type: 'negative',
                  message: err.response.data.message
                });
              } else {
                $q.notify({
                  type: 'negative',
                  message: 'Something went wrong'
                });
              }
            }).finally(() => {
              $q.loading.hide();
            });
          } else {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            api.post($store.state.app.baseURL + '/login', model.value).then((res: CustomAxiosResponse) => {
              if (res.data.message === 'success') {
                $router.push('/').catch((err) => console.log(err));
              }
            }).catch((err:CustomAxiosError) => {
              console.log(err.response);
              if (err.response.status === 422) {
                $q.notify({
                  type: 'negative',
                  message: err.response.data.message
                });
              } else {
                $q.notify({
                  type: 'negative',
                  message: 'Something went wrong'
                });
              }
            }).finally(() => {
              $q.loading.hide();
            });
          }
        }
      });
    }

    const appLoading = ref(true)

    onMounted(() => {
      $store.dispatch('app/init').then((msg:string) => {
        if (msg === 'authenticated') {
          $router.push('/').catch((err) => console.log(err));
        }
      }).catch((msg:string) => {
        if (msg === 'unauthenticated') {
          appLoading.value = false
        }
      })
    })
    return {
      model,
      isVisiblePassword,
      loginform,
      loginFn,
      appLoading
    }
  },
})
</script>
