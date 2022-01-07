<template>
  <q-page class="q-pa-sm">
    <q-table
    title="Stores"
    :rows="items"
    :columns="columns">
    <template v-slot:top>
        <div class="text-h6">Stores</div>
        <q-space/>
        <q-btn color="primary" label="Create" to="/stores/create"/>
    </template>
    </q-table>
  </q-page>
</template>
<script lang="ts">
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { defineComponent, ref, onMounted } from 'vue'

interface ItemInterface {
  id: number,
  name: string,
  thumbnail: {
    url: string
  },
  created_at: string
}
export default defineComponent({
  setup() {
    const $q = useQuasar();
    const columns = [
      {
        name: 'id',
        field: 'id',
        label: 'ID',
        sortable: true,
        align: 'left'
      },
      {
        name: 'thumbnail',
        field: (row: {thumbnail: {url: string} | null}) => row.thumbnail ? 'storage/' + row.thumbnail.url : '',
        label: '',
        sortable: false,
        align: 'left'
      },
      {
        name: 'name',
        field: 'name',
        label: 'Name',
        sortable: true,
        align: 'left'
      },
      {
        name: 'status',
        field: 'status',
        label: 'Status',
        sortable: true,
        align: 'left'
      },
      {
        name: 'created_at',
        field: 'created_at',
        label: 'Created At',
        format: (val: string) => new Date(val).toLocaleDateString('en-IN')
      }
    ]

    const items = ref<ItemInterface[]>([])

    const getDataFromApi = () => {
      $q.loading.show();
      api.get('stores').then((res: {data: ItemInterface[]}) => {
        items.value = res.data
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        $q.loading.hide();
      });
    }
    onMounted(() => {
      getDataFromApi();
    })
    return {
      columns,
      items,
    }
  },
})
</script>
