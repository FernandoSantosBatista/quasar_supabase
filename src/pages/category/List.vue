<template>
  <q-page padding>
    <div class="row">
      <q-table
        :rows="categories"
        :columns="columns"
        row-key="name"
        class="col-12"
        :loading="loading"
      >
      <template v-slot:top>
          <span class="text-h6">
            Documentos
          </span>

          <q-space />
        </template>
    <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-md">
          <q-btn icon="mdi-pencil-outline" color="info"  dense size="sm" @click="editForm(props.row)"/>
          <q-btn icon="mdi-delete-outline" color="negative" dense size="sm" @click="handleRemoveProduct(props.row)" />
        </q-td>
      </template>
      </q-table>
      <q-page-sticky position="bottom" :offset="[0, 18]">
    <q-btn fab icon="add" color="primary" :to="{ name: 'formulario-category' }" />
  </q-page-sticky>
      </div>
      </q-page>
</template>

<script>
const columns = [
  { name: 'name', align: 'center', label: 'Name', field: 'name', sortable: true },
  { name: 'actions', label: 'ações', field: 'actions', sortable: true }

]

import { defineComponent, ref, onMounted } from 'vue'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'category-list',
  setup () {
    const categories = ref([])
    const { list, remove } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const router = useRouter()
    const table = 'categories'
    const $q = useQuasar()
    const loading = ref(true)

    const handleListCategories = async () => {
      try {
        loading.value = true
        categories.value = await list('categories')
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }
    const handleRemoveProduct = async (categories) => {
      try {
        $q.dialog({
          title: 'Confirm',
          message: `Deseja realmente exluir ${categories.name} ?`,
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await remove(table, categories.id)
          notifySuccess('Excluido com sucesso')
          handleListCategories()
        })
      } catch (error) {
        notifyError(error.message)
      }
    }
    const editForm = (categories) => {
      router.push({ name: 'formulario-category', params: { id: categories.id } })
    }
    onMounted(() => {
      handleListCategories()
    })

    return {
      columns,
      categories,
      editForm,
      loading,
      handleRemoveProduct
    }
  }
})
</script>

<style>

</style>
