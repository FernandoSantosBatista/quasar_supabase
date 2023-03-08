<template>
  <q-page padding>
    <div class="row">
      <q-table
        :rows="products"
        :columns="columns"
        row-key="name"
        class="col-12"
        :loading="loading"
      >
      <template v-slot:top>
          <span class="text-h6">
            Produtos
          </span>

          <q-space />
        </template>
        <template v-slot:body-cell-img_url="props">
          <q-td :props="props">
            <q-avatar v-if="props.row.img_url">
              <img :src="props.row.img_url">
            </q-avatar>
            <q-avatar v-else color="grey" text-color="white" icon="mdi-image-off" />
          </q-td>
        </template>
    <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-md">
          <q-btn icon="mdi-pencil-outline" color="info"  dense size="sm" @click="editForm(props.row)"/>
          <q-btn icon="mdi-delete-outline" color="negative" dense size="sm" @click="handleRemoveProduct(props.row)" />
        </q-td>
      </template>
      </q-table>
      <q-page-sticky position="bottom" :offset="[0, 18]">
    <q-btn fab icon="add" color="primary" :to="{ name: 'form-product' }" />
  </q-page-sticky>
      </div>
      </q-page>
      {{products}}
</template>

<script>
const columns = [
  { name: 'img_url', align: 'left', label: 'Img', field: 'img_url', sortable: false },
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
  { name: 'amount', align: 'left', label: 'Amount', field: 'amount', sortable: true },
  { name: 'price', align: 'left', label: 'Price', field: 'price', sortable: true },
  { name: 'actions', align: 'right', label: 'Actions', field: 'actions', sortable: false }
]

import { defineComponent, ref, onMounted } from 'vue'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'product-list',
  setup () {
    const products = ref([])
    const { list, remove } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const router = useRouter()
    const table = 'products'
    const $q = useQuasar()
    const loading = ref(true)

    const handleListProducts = async () => {
      try {
        loading.value = true
        products.value = await list('products')
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }
    const handleRemoveProduct = async (products) => {
      try {
        $q.dialog({
          title: 'Confirm',
          message: `Deseja realmente exluir ${products.name} ?`,
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await remove(table, products.id)
          notifySuccess('Excluido com sucesso')
          handleListProducts()
        })
      } catch (error) {
        notifyError(error.message)
      }
    }
    const editForm = (products) => {
      router.push({ name: 'form-product', params: { id: products.id } })
    }
    onMounted(() => {
      handleListProducts()
    })

    return {
      columns,
      products,
      editForm,
      loading,
      handleRemoveProduct
    }
  }
})
</script>

<style>

</style>
