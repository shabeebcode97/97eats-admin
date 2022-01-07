<template>
  <q-tab-panels
    v-model="tab"
    animated
    transition-prev="slide-down"
    transition-next="slide-up">
    <q-tab-panel name="basic">
      <q-form ref="basicForm">
        <q-card>
          <q-card-section class="row q-col-gutter-sm">
            <template v-for="lang in $store.state.app.languages" :key="lang.code">
              <div class="col-3" v-if="lang.code !== 'en'">
                <q-toggle v-model="translations" :label="lang.label" :val="lang.code"/>
              </div>
            </template>
            <div class="col-3">
              <q-toggle v-model="model.is_featured" label="Is Featured" tabindex="4"/>
            </div>
          </q-card-section>
          <q-card-section>
            <q-card class="bg-grey-1" flat>
              <q-card-section :class="translations.length > 0 ? '' :'q-pa-none'">
                <q-input outlined dense label="Store Name" v-model="model.name" :rules="[v => !!v || 'Required']" tabindex="1"/>
              </q-card-section>
              <template v-if="translations.length > 0">
                <q-separator/>
                <q-card-section>
                  <template  v-if="model.translations.name">
                    <template v-for="lang in $store.state.app.languages" :key="lang.code">
                      <q-input v-if="lang.code !== 'en'"
                        outlined dense
                        :label="'Store Name (' + lang.label + ')'"
                        v-model="model.translations.name[lang.code]"
                        :dir="lang.code === 'ar' ? 'rtl' : 'ltr'"
                        tabindex="1"/>
                    </template>
                  </template>
                </q-card-section>
              </template>
            </q-card>
            <q-card class="bg-grey-1 q-mt-md" flat>
              <q-card-section :class="translations.length > 0 ? '' :'q-pa-none'">
                <q-input outlined dense label="Store Description"
                  v-model="model.description" :rules="[v => !!v || 'Required']" type="textarea"
                  tabindex="2"/>
              </q-card-section>
              <template v-if="translations.length > 0">
                <q-separator/>
                <q-card-section>
                  <template  v-if="model.translations.name">
                    <template v-for="lang in $store.state.app.languages" :key="lang.code">
                      <q-input v-if="lang.code !== 'en'"
                        outlined dense
                        :label="'Store Description (' + lang.label + ')'"
                        v-model="model.translations.description[lang.code]"
                        type="textarea" :dir="lang.code === 'ar' ? 'rtl' : 'ltr'"
                        tabindex="2"/>
                    </template>
                  </template>
                </q-card-section>
              </template>
            </q-card>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-auto flex items-center q-mb-md">
                <div class="text-subtitle1 text-bold">Rating</div>
              </div>
              <div class="col-auto flex items-center q-mb-md">
                <q-rating
                  v-model="model.rating"
                  size="sm"
                  color="yellow-9"
                  icon="star_border"
                  icon-selected="star"
                  icon-half="star_half"
                  tabindex="-1"/>
              </div>
              <div class="col-auto">
                <q-input
                  dense outlined
                  type="number"
                  v-model.number="model.rating"
                  min="0"
                  max="5"
                  tabindex="3"
                  :rules="[v => isNaN(v) ? 'Invalid. Numbers only' : true, v => parseFloat(v) >= 0 && parseFloat(v) <= 5 ? true : 'Invalid. Only numbers between 0 & 5 allowed']"/>
              </div>
              <div class="col-auto">
                <q-toggle v-model="model.is_auto_acceptable" label="Is Auto Acceptable ?"/>
              </div>
              <div class="col-auto">
                <q-toggle v-model="model.is_notifiable" label="Is Notifiable?"/>
              </div>
            </div>
            <div class="row" v-if="model.meta">
              <div class="col-3" v-for="key in Object.keys(model.meta)" :key="key">
                <q-input v-if="model.meta[key].type === 'number'"
                  v-model.number="model.meta[key].value"
                  outlined dense min="0"
                  :rules="[v => parseFloat(v) >= 0 ? true : 'Invalid']"
                  type="number" :label="unSluggify(key)"
                  tabindex="4"/>
                <q-toggle v-if="model.meta[key].type === 'boolean'"
                  v-model="model.meta[key].value" :label="unSluggify(key)"
                  tabindex="4"/>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-form>
    </q-tab-panel>
    <q-tab-panel name="address">
      <q-form ref="addressForm">
        <q-card>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input v-model="model.address.line_1" label="Line 1" dense outlined :rules="[v => !!v || 'Required']"/>
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="model.address.line_1" label="Line 2" dense outlined/>
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input v-model="model.address.city" label="City" dense outlined :rules="[v => !!v || 'Required']"/>
              </div>
              <div class="col-12 col-md-6">
                <q-select v-model="model.address.country" :options="countryOptions" option-label="name" option-value="id" label="Country" dense outlined/>
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-3">
                <q-input dense outlined label="Latitude" type="number" v-model.number="model.address.latitude" :rules="[v => !!v || 'Required']"/>
              </div>
              <div class="col-3">
                <q-input dense outlined label="Latitude" type="number" v-model.number="model.address.longitude" :rules="[v => !!v || 'Required']"/>
              </div>
            </div>
            <GoogleMap
              @click="getLoc"
              :api-key="apiKey"
              style="width: 100%; height: 500px"
              :center="center"
              :zoom="15"
            >
              <Marker :options="{ position: center }"/>
            </GoogleMap>
          </q-card-section>
        </q-card>
      </q-form>
    </q-tab-panel>
    <q-tab-panel name="delivery">
      <q-form ref="deliveryForm">
        <q-card>
          <q-card-section>
            <div class="row">
              <q-select
                v-model="model.delivery_type"
                label="Delivery Type"
                dense outlined
                :options="deliveryTypeOptions"
                option-value="id"
                option-label="name"/>
            </div>
          </q-card-section>
        </q-card>
      </q-form>
    </q-tab-panel>
    <q-tab-panel name="schedule">
      <q-form ref="scheduleForm">
        <q-card>
          <q-card-section>
            <div class="row q-mb-md">
              <q-input v-model="loc" label="Point"/>
            </div>
          </q-card-section>
        </q-card>
      </q-form>
    </q-tab-panel>
  </q-tab-panels>
</template>
<script lang="ts">
export interface ModelInterface {
  name: string | null;
  translations: {
    name: {[key:string]: string | null} | null,
    description: {[key:string]: string | null} | null,
  },
  description: string | null;
  rating: number;
  address: {
    line_1: string | null,
    line_2: string | null,
    city: string | null,
    country: {
      id: number,
      name: string,
      currencycode: string
    },
    latitude: number | null,
    longitude: number | null
  },
  delivery_type: number | null;
  type: {
    id: number,
    name: string
  } | null;
  meta: {
    [key: string]: {
      type: string,
      value:number | boolean | string | null
    }
  } | null;
  is_featured: boolean;
  is_auto_acceptable: boolean;
  is_notifiable: boolean;
  is_schedulable: boolean;
  schedules: {
    day: string,
    open: string,
    close: string
  }[] | null
}
import { QForm, useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useStore } from 'src/store'
import { defineComponent, computed, ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LanguagesInterface } from 'src/store/app/state'

export default defineComponent({
  
  setup() {
    const $store = useStore()
    const $route = useRoute()
    const $router = useRouter()
    const $q = useQuasar()
    onMounted(() => {

      if ($route.params.id) {
        $q.loading.show()
        api.get('stores/' + $route.params.id.toString()).then((res: {data: ModelInterface}) => {
          model.value = res.data
        }).catch((e) => console.log(e)).finally(() => {
          $q.loading.hide()
        })
      } 
      if (!$store.state.app.languages) {
        $q.notify({
          type: 'negative',
          message: 'Languages not set. Please Check'
        })
        $router.push({name:'dashboard'}).catch(e => console.log(e))
      } else {
        model.value.translations.name = <{ [key:string] : string | null }>{}
        model.value.translations.description = <{ [key:string] : string | null }>{}
        $store.state.app.languages?.forEach((lang: LanguagesInterface) => {
          if (model.value.translations.name){
            model.value.translations.name[lang.code] = null 
          }
          if (model.value.translations.description){
            model.value.translations.description[lang.code] = null
          }
        })
        $q.loading.show()
        Promise.all([
          api.get('countries').then((res: {
            data: {
              id: number,
              name: string,
              currencycode: string
            }[]
          }) => {
            countryOptions.value = res.data
          }).catch(e =>  console.log(e)),
          api.get('delivery_types').then((res: {
            data: {
              id: number,
              name: string
            }[]
          }) => {
            deliveryTypeOptions.value = res.data
          }).catch(e =>  console.log(e)),
          api.get('store_types').then((res:{
            data:{
              id: number,
              name: string
            }[]
          }) => {
            typeOptions.value = res.data
            if (typeOptions.value.length === 1) {
              model.value.type = typeOptions.value[0]
            }
          }).catch(e => console.log(e))
        ])
        .catch(() => {console.log('')})
        .finally(() => $q.loading.hide())
      }
    })
    const countryOptions = ref<{
      id: number,
      name: string,
      currencycode: string
    }[]>([])
    const model = ref<ModelInterface>({
      name: null,
      translations: {
        name: null,
        description: null,
      },
      description: null,
      rating: 0,
      address: {
        line_1: null,
        line_2: null,
        city: null,
        country: {
          id: 227,
          name: 'United Arab Emirates',
          currencycode: 'AED'
        },
        latitude: null,
        longitude: null
      },
      delivery_type: null,
      type: null,
      meta: null,
      is_featured: false,
      is_auto_acceptable: false,
      is_notifiable: true,
      is_schedulable: false,
      schedules: null
    })
    const translations = ref<string[] | null>([])
    const deliveryTypeOptions = ref<{id: number, name: string}[]>([])
    const typeOptions = ref<{id: number, name: string}[]>([])
    const basicForm = ref<QForm>()
    const addressForm = ref<QForm>()
    const deliveryForm = ref<QForm>()
    const scheduleForm = ref<QForm>()
    const storeType = computed(() => model.value.type)
    watch(storeType, (newV) => {
      if (newV?.name === 'Restaurant') {
        model.value.meta = {
          is_pure_veg: {
            type: 'boolean',
            value: true
          },
          price_for_two: {
            type: 'number',
            value: 0
          }
        }
      }
    })
    const unSluggify = (key: string) => {
      let str = key.replace(/_/g,' ')
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
    const center = { lat: 25.805193956887074, lng: 55.98039657830486 }
    const loc = ref('')
    const apiKey = 'AIzaSyAceRQAfeKdw1EQFmtKh7u2BTLIHI6TU8s' 
    const getLoc = (val:{latLng:{lat: () => number, lng: () => number}}) => {
      console.log(val)
      model.value.address.latitude = val.latLng.lat()
      model.value.address.longitude =  val.latLng.lng()
      /*
      apiWithoutCredentials.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + val.latLng.lat().toString() + ',' + val.latLng.lng().toString() + '&key=' + apiKey).then((res: {data:{
        results: {
          formatted_address: string
        }[]
      }}) => {
        model.value.address.line_1 = res.data.results[0].formatted_address
      }).catch(e => console.log(e))
      */
    }
    return {
      model,
      translations,
      deliveryTypeOptions,
      typeOptions,
      basicForm,
      addressForm,
      deliveryForm,
      unSluggify,
      scheduleForm,
      center,
      loc,
      getLoc,
      apiKey,
      countryOptions
    }
  },
})
</script>