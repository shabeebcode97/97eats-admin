<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-card-section class="row bg-grey-1" >
        <div class="text-h6 text-bold">
          {{pageTitle}}
        </div>
        <q-space/>
        <div class="col-auto">
          <q-select label="Store Type" v-model="model.type" :options="typeOptions" dense outlined
            option-label="name" option-value="id"/>
        </div>
      </q-card-section>
      <q-separator/>
      <q-splitter
      :horizontal="$q.screen.lt.md"
      v-model="splitterModel"
      :style="$q.screen.lt.md ? '' : 'height:calc(100vh - 140px)'"
      >
        <template v-slot:before>
          <q-tabs v-model="tab" :vertical="$q.screen.gt.sm" class="bg-grey-2 text-secondary"
            outside-arrows
            mobile-arrows>
            <q-tab name="basic" icon="feed" label="Basic Details"/>
            <q-tab name="address" icon="contact_mail" label="Address & Location"/>
            <q-tab name="delivery" icon="delivery_dining" label="Delivery Details"/>
            <q-tab name="schedule" icon="schedule" label="Schedule"/>
          </q-tabs>
        </template>
        <template v-slot:after>
          <q-tab-panels
            v-model="tab"
            animated
            transition-prev="slide-down"
            transition-next="slide-up">
            <q-tab-panel name="basic">
              <q-form ref="basicForm">
                <q-card>
                  <q-card-section class="row q-col-gutter-md">
                    <template v-for="lang in $store.state.app.languages" :key="lang.code">
                      <div class="col-md-3 col-6" v-if="lang.code !== 'en'">
                        <q-toggle v-model="translations" :label="lang.label" :val="lang.code"/>
                      </div>
                    </template>
                    <div class="col-md-3 col-6">
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
                    <div class="row">
                      <div class="col">
                        <q-input label="Email"
                          v-model="model.email"
                          dense outlined/>
                      </div>
                    </div>
                    <div class="row q-col-gutter-md q-mt-md">
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
                    <div class="row q-mt-md">
                      <div class="col">
                        <q-input label="Invoice Name"
                          v-model="model.invoice_name"
                          dense outlined/>
                      </div>
                    </div>
                    <div class="row q-mt-md">
                      <div class="col">
                        <q-input label="Invoice Email"
                          v-model="model.invoice_email"
                          dense outlined/>
                      </div>
                    </div>
                    <div class="row q-mt-md q-col-gutter-md">
                      <div class="col-auto">
                        <q-toggle label="Has TRN No. ?"
                          v-model="model.has_trn"/>
                      </div>
                      <div class="col">
                        <q-input label="TRN No"
                          v-model="model.trn_number"
                          :disable="!model.has_trn"
                          dense outlined/>
                      </div>
                    </div>
                    <div class="row q-mt-md" v-if="model.meta">
                      <div class="col-md-3 col-6" v-for="key in Object.keys(model.meta)" :key="key">
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
                    <div class="row q-col-gutter-md q-mt-md">
                      <div class="col-12 col-md-6">
                        <q-input v-model="model.address.city" label="City" dense outlined :rules="[v => !!v || 'Required']"/>
                      </div>
                      <div class="col-12 col-md-6">
                        <q-select v-model="model.address.country" :options="countryOptions" option-label="name" option-value="id" label="Country" dense outlined/>
                      </div>
                    </div>
                    <div class="row q-col-gutter-md q-mt-md">
                      <div class="col-md-3 col-6">
                        <q-input dense outlined label="Latitude" type="number" v-model.number="model.address.latitude" :rules="[v => !!v || 'Required']" />
                      </div>
                      <div class="col-md-3 col-6">
                        <q-input dense outlined label="Latitude" type="number" v-model.number="model.address.longitude" :rules="[v => !!v || 'Required']"/>
                      </div>
                      <div class="col-auto">
                        <q-btn color="secondary" label="Open Map" icon="map" @click="openMapDialog"/>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </q-form>
            </q-tab-panel>
            <q-tab-panel name="delivery">
              <q-form ref="deliveryForm">
                <q-card>
                  <q-card-section>
                    <div class="row">
                      <div class="col">
                        <q-select
                          v-model="model.delivery_type"
                          label="Delivery Type"
                          dense outlined
                          multiple
                          hint="Multi select possible"
                          :options="deliveryTypeOptions"
                          option-value="id"
                          option-label="name"/>
                      </div>
                    </div>
                    <div class="row q-mt-md" v-if="deliveryTypeIsDelivery">
                      <div class="col">
                        <q-select
                          v-model="model.delivery_method"
                          label="Delivery Method"
                          dense outlined
                          multiple
                          hint="Multi select possible"
                          :options="deliveryMethodOptions"
                          option-value="id"
                          option-label="name"/>
                      </div>
                    </div>
                    <div class="col"  v-if="deliveryMethodIsStore"> 
                      <div class="col-12 col q-mt-md">
                        <q-input label="Commission Rate for Store Delivery" type="number" v-model="model.commission_rates.delivery.store" dense outlined :rules="[v => !!v || 'Required']"/>
                      </div> 
                    </div>
                    <div class="col"  v-if="deliveryMethodIsCompany">
                      <div class="col-12 col q-mt-md">
                        <q-input label="Commission Rate for Company Delivery (97Eats)" type="number" v-model="model.commission_rates.delivery.company" dense outlined :rules="[v => !!v || 'Required']"/>
                      </div>
                    </div>
                                                                                                                                 
                    <div class="col"  v-if="deliveryTypeIsSelf"> 
                      <div class="col-12 col q-mt-md">
                        <q-input label="Commission Rate for Self Pickup" type="number" v-model="model.commission_rates.self" dense outlined :rules="[v => !!v || 'Required']"/>
                      </div>
                    </div>

                  </q-card-section>
                </q-card>
              </q-form>
            </q-tab-panel>
            <q-tab-panel name="schedule">
              <q-form ref="scheduleForm">
                <q-card>
                  <q-card-section>
                    <div class="text-h6 text-weight-bold">RESTAURANT SCHEDULING TIMES</div>
                    <div class="text-h6">Monday</div>
                    <div class="col" >
                      <div class="col-12 col q-mt-md"  >
                        <q-input label="Opening Time" v-model="model.time_schedule.monday[0].open" mask="time" dense outlined :rules="[v => !!v || 'Required']" >
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="model.time_schedule">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>

                        <q-input label="Closing Time"  v-model="time" mask="time" dense outlined :rules="[v => !!v || 'Required']">
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="time">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                      <div class="btn">
                        <q-btn push color="primary" label="Add Slot"/>
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator/>
                  <q-card-section>
                    <div class="text-h6">Tuesday</div>
                    <div class="col">
                      <div class="col-12 col q-mt-md">
                        <q-input label="Opening Time" v-model="model.time_schedule" mask="time" dense outlined :rules="[v => !!v || 'Required']">
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="model.time_schedule">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                        <q-input label="Closing Time" v-model="model.time_schedule" mask="time" dense outlined :rules="[v => !!v || 'Required']">
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="model.time_schedule">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                      <div class="btn">
                        <q-btn push color="primary" label="Add Slot" />
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator/>
                  <q-card-section>
                    <div class="text-h6">Wednesday</div>
                    <div class="col">
                      <div class="col-12 col q-mt-md" >
                        <q-input label="Opening Time" v-model="model.time_schedule" mask="time" dense outlined :rules="[v => !!v || 'Required']">
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="model.time_schedule">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                        <q-input label="Closing Time" v-model="model.time_schedule" mask="time" dense outlined :rules="[v => !!v || 'Required']">
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="model.time_schedule">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                      <div class="btn">
                        <q-btn push color="primary" label="Add Slot" />
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator/>
                  <q-card-section>
                    <div class="text-h6">Thursday</div>
                    <div class="col">
                      <div class="col-12 col q-mt-md">
                        <q-input label="Opening Time" v-model="model.time_schedule" mask="time" dense outlined :rules="[v => !!v || 'Required']">
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="model.time_schedule">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                        <q-input label="Closing Time" v-model="model.time_schedule" mask="time" dense outlined :rules="[v => !!v || 'Required']">
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="model.time_schedule">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                      <div class="btn">
                        <q-btn push color="primary" label="Add Slot" />
                      </div>
                    </div>
                  </q-card-section> 
                  <q-separator/>
                  <q-card-section>
                    <div class="text-h6">Friday</div>
                    <div class="col">
                      <div class="col-12 col q-mt-md">
                        <q-input label="Opening Time" v-model="model.time_schedule" mask="time" dense outlined :rules="[v => !!v || 'Required']">
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="model.time_schedule">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                        <q-input label="Closing Time" v-model="model.time_schedule" mask="time" dense outlined :rules="[v => !!v || 'Required']">
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="model.time_schedule">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                      <div class="btn">
                        <q-btn push color="primary" label="Add Slot" />
                      </div>
                    </div>         
                  </q-card-section>  
                  <q-separator/>
                  <q-card-section>
                    <div class="text-h6">Saturday</div>
                    <div class="col">
                      <div class="col-12 col q-mt-md">
                        <q-input label="Opening Time" v-model="model.time_schedule" mask="time" dense outlined :rules="[v => !!v || 'Required']">
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="model.time_schedule">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                        <q-input label="Closing Time" v-model="model.time_schedule" mask="time" dense outlined :rules="[v => !!v || 'Required']">
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="model.time_schedule">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                      <div class="btn">
                        <q-btn v-on:click="addSlot()" push color="primary" label="Add Slot" />
                      </div>
                    </div>
                  </q-card-section> 
                  <q-separator/>
                  <q-card-section>
                    <div class="text-h6 ">Sunday</div>
                    <div class="col">
                      <div class="col-12 col q-mt-md">
                        <q-input label="Opening Time" v-model="model.time_schedule" mask="time" dense outlined :rules="[v => !!v || 'Required']">
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="model.time_schedule">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                        <q-input label="Closing Time" v-model="model.time_schedule" mask="time" dense outlined :rules="[v => !!v || 'Required']">
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="model.time_schedule">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                      <div class="btn">
                        <q-btn push color="primary" label="Add Slot" />
                      </div>
                    </div>
                  </q-card-section> 
                    
                    

                                  
                </q-card>               
              </q-form>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </q-card>
  </q-page>
  <q-dialog v-model="mapDialog" maximized>
    <q-card>
      <q-bar class="bg-primary">
        <q-space/>
        <q-btn flat dense icon="close" @click="mapDialog = false"/>
      </q-bar>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-md-3 order-md-last col-12">
            <q-input v-model.number="latitude" label="Latitude" dense outlined readonly/>
            <q-input class="q-mt-md" v-model.number="longitude" label="Longitude" dense outlined readonly/>
            <q-btn class="q-mt-md full-width" color="primary" label="Save" @click="saveMapDialog"/>
          </div>
          <div class="col-md-9 order-md-first col-12">
            <GoogleMap
              @click="getLoc"
              :api-key="apiKey"
              style="width: 100%; height: 500px"
              :center="center"
              :zoom="15"
            >
              <Marker :options="{ position: center }"/>
            </GoogleMap>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
export interface ModelInterface {
  name: string | null;
  email: string | null;
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
  delivery_type: {
    id: number,
    name: string,
    sysname: string
  }[] | null;
  delivery_method: {
    id: number,
    name: string,
    sysname: string
  }[] | null;
  commission_rates: {
    self: number,
    delivery: {
        store: number,
        company: number
    }
  }; 
  time_schedule: {
    monday: {
        open: string | null,
        close: string | null
    }[] | null,
    tuesday: {
        open: string | null,
        close: string | null
    }[] | null,
    wednesday: {
        open: string | null,
        close: string | null
    }[] | null,
    thursday: {
        open: string | null,
        close: string | null
    }[] | null,
    friday: {
        open: string | null,
        close: string | null
    }[] | null,
    saturday: {
        open: string | null,
        close: string | null
    }[] | null,
    sunday: {
        open: string | null,
        close: string | null
    }[] | null,
  } | null;
 
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
  }[] | null;
  invoice_name: string | null;
  invoice_email: string | null;
  has_trn: boolean;
  trn_number: string | null;
  store_delivery_details: {
    base_charge: number,
    max_charge: number,
    base_distance: number,
    extra_charge: number,
    extra_distance: number,
    min_delivery_time: number,
    max_delivery_time: number
  },
  store_charge: number,
  company_geo_fence: string | null,
  store_geo_fence: string | null,
}
import { QForm, useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useStore } from 'src/store'
import { defineComponent, computed, ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LanguagesInterface } from 'src/store/app/state'
import { GoogleMap, Marker } from 'vue3-google-map'
export default defineComponent({
  components: { GoogleMap, Marker },
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
          pageTitle.value = model.value.name ? model.value.name : ''
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
          api.get('delivery_methods').then((res: {
            data: {
              id: number,
              name: string
            }[]
          }) => {
            deliveryMethodOptions.value = res.data
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
          }).catch(e => console.log(e)),
          
        
          
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
    const pageTitle = ref('Create Store')
    const model = ref<ModelInterface>({
      name: null,
      email: null,
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
      delivery_method: null,
      commission_rates: {
        self: 0,
        delivery: {
          store:0,
          company:0
        }
      },
      
      type: null,
      meta: null,
      is_featured: false,
      is_auto_acceptable: false,
      is_notifiable: true,
      is_schedulable: false,
      schedules: null,
      invoice_name: null,
      invoice_email: null,
      has_trn: false,
      trn_number: null,
      store_charge: 0,
      store_delivery_details: {
        base_charge: 0,
        max_charge: 0,
        base_distance: 0,
        extra_charge: 0,
        extra_distance: 0,
        min_delivery_time: 0,
        max_delivery_time: 0
      },
      store_geo_fence: null,
      company_geo_fence: null,
      time_schedule: {
        monday: [{
          open: null,
          close: null
        }],
        tuesday: [{
          open: null,
          close: null
        }],
    wednesday: [{
             open: null,
        close: null
    }],
    thursday: [{
             open: null,
        close: null
    }],
    friday: [{
             open: null,
        close: null
    }],
    saturday: [{
             open: null,
        close: null
    }],
    sunday: [{
        open: null,
        close: null
    }], 
  }
    }) 
    const translations = ref<string[] | null>([])
    const deliveryTypeOptions = ref<{id: number, name: string}[]>([])
    const deliveryMethodOptions = ref<{id: number, name: string}[]>([])
    const tab = ref('basic')
    const splitterModel = ref(20)
    const typeOptions = ref<{id: number, name: string}[]>([])
    const basicForm = ref<QForm>()
    const addressForm = ref<QForm>()
    const deliveryForm = ref<QForm>()
    const scheduleForm = ref<QForm>()
    const time= ref(null)
    const storeType = computed(() => model.value.type)
    watch(storeType, (newV) => {
      if (newV?.name === 'Restaurant') {
        model.value.meta = {
          is_pure_veg: {
            type: 'boolean',
            value: false
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
    const center = ref({ lat: 25.805193956887074, lng: 55.98039657830486 })
    const loc = ref('')
    const apiKey = 'AIzaSyAceRQAfeKdw1EQFmtKh7u2BTLIHI6TU8s' 
    const getLoc = (val:{latLng:{lat: () => number, lng: () => number}}) => {
      latitude.value = val.latLng.lat()
      longitude.value =  val.latLng.lng()
      center.value = {
        lat: latitude.value,
        lng: longitude.value
      }
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
    const deliveryType = computed(() => model.value.delivery_type)

    const deliveryMethod = computed(() => model.value.delivery_method)

   

    
    const deliveryTypeIsSelf = ref(false)

    const deliveryTypeIsDelivery = ref(false)
    watch(deliveryType,(newV) => {
      
      if (newV !== null) {
        const sysNames = newV.map( v => v.sysname)
        if (sysNames.includes('self')) {
          deliveryTypeIsSelf.value = true
        }
        else {
          deliveryTypeIsSelf.value = false
        }
        if (sysNames.includes('delivery')) {
          deliveryTypeIsDelivery.value = true
        }
        else {
          deliveryTypeIsDelivery.value = false
        }
       
      }
      
    })
    const deliveryMethodIsStore = ref(false)
     
    const deliveryMethodIsCompany = ref(false)
     watch(deliveryMethod,(newV) => {
      
      if (newV !== null) {
        const sysNames = newV.map( v => v.sysname)
        if (sysNames.includes('company'))
        {
          deliveryMethodIsCompany.value = true
        }
        else {
          deliveryMethodIsCompany.value = false
        }
        if (sysNames.includes('store'))
        {
          deliveryMethodIsStore.value = true
        }
        else {
          deliveryMethodIsStore.value = false
        }
        
      }
      
    })
    const mapDialog = ref(false)
    const latitude = ref<number | null>(null)
    const longitude = ref<number | null>(null)
    const saveMapDialog = () => {
      if (latitude.value && longitude.value) {
        model.value.address.latitude = latitude.value
        model.value.address.longitude = longitude.value
      }
      mapDialog.value = false
    }
    



    const openMapDialog = () => {
      if(model.value.address.latitude && model.value.address.longitude) {
        latitude.value = model.value.address.latitude
        longitude.value = model.value.address.longitude
        center.value.lat = latitude.value
        center.value.lng = longitude.value
      } else {
        center.value = { lat: 25.805193956887074, lng: 55.98039657830486 }
      }
      mapDialog.value = true
    }
    
    
    

      
   
   

    return {
      model,
      pageTitle,
      translations,
      deliveryTypeOptions,
      tab,
      splitterModel,
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
      countryOptions,
      deliveryMethodOptions,
      deliveryTypeIsDelivery,
      deliveryMethodIsStore,
      saveMapDialog,
      openMapDialog,
      mapDialog,
      longitude,
      latitude,
      deliveryTypeIsSelf,
      deliveryMethodIsCompany,
      time,
     
      
      
      
      
      
      
      
      
    }
  },
}) 
</script>
