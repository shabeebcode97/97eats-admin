<template>
  <q-expansion-item
  class=""
  v-if="children"
  icon="perm_identity"
  :label="title">
    <q-list class="bg-grey-3">
      <template v-for="(child,i) in children" :key="i">
        <q-item
          class=""
          active-class="bg-yellow-5"
          clickable
          :to="child.link"
        >
          <q-item-section
            v-if="child.icon"
            avatar
          >
            <q-icon :name="child.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ child.title }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator/>
      </template>
    </q-list>
  </q-expansion-item>
  <q-item
    v-else
    class="text-black"
    clickable
    :to="link"
    exact-active-class="bg-yellow-5"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    children: {
      type: Array,
      default: null
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
  }
})
</script>
