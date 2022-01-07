<template>
  <q-layout view="lHh Lpr lFf" v-if="!appLoading">
    <q-header elevated>
      <q-toolbar class="bg-grey-8">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          97Eats Admin
        </q-toolbar-title>

        <div class="text-subtitle2">{{ new Date().toDateString('en-IN')}}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="250"
    >
      <q-list>
        <q-card flat>
          <q-card-section class="items-center justify-center column">
            <q-avatar size="100px" font-size="52px" color="grey-2" icon="account_circle" />
            <div class="text-subtitle1 q-mt-md">Hello {{$store.getters['app/user'].name}}</div>
          </q-card-section>
          <q-card-actions class="flex justify-center q-pt-none">
            <q-btn flat icon="logout" round size="sm" @click="logoutFn">
              <q-tooltip>Logout</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
        <template v-for="link in essentialLinks" :key="link.title">
          <SidebarLink
            v-bind="link"
          />
          <q-separator/>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import SidebarLink from '../components/SidebarLink.vue'
import sidebarlinks from '../router/sidebarlinks'
import { defineComponent, ref, onMounted } from 'vue'
import { useStore } from '../store'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { AxiosError } from 'axios'
import { LanguagesInterface } from 'src/store/app/state'
export default defineComponent({
  name: 'MainLayout',

  components: {
    SidebarLink
  },

  setup () {
    const $store = useStore()

    const $router = useRouter()

    const leftDrawerOpen = ref(false)

    const appLoading = ref(true)

    onMounted(() => {
      console.log(process.env.TOKEN)
      $store.dispatch('app/init').then((msg:string) => {
        if (msg === 'authenticated') {
          api.get('languages').then((res: {data: LanguagesInterface}) => {
            $store.commit('app/setLanguages', res.data)
            appLoading.value = false;
          }).catch((e) => console.log(e))
        }
      }).catch((msg) => {
        if (msg === 'unauthenticated') {
          $router.push('/login').catch((err) => {
            console.log('Error occured in router push. ')
            console.log(err)
          })
        }
      })
    })
    const logoutFn = () => {
      if(process.env.DEV && process.env.TOKEN) {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        api.post(process.env.API + '/sanctum/revoke/current').then((res: {data: {message: string}}) => {
          if (res.data.message == 'success') {
            $router.push('/login').catch((e) =>  console.log(e))
          }
        }).catch((err: AxiosError) => {
          console.log(err.response)
        })
      } else {
        api.post('logout').then((res: {data: {message: string}}) => {
          if (res.data.message == 'success') {
            $router.push('/login').catch((e) =>  console.log(e))
          }
        }).catch((err: AxiosError) => {
          console.log(err.response)
        })
      }
    }
    return {
      logoutFn,
      appLoading,
      essentialLinks: sidebarlinks,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
