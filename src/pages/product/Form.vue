<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">
          Produto
        </p>
      </div>
      <q-form class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
        <q-input
          label="Image"
          stack-label
          v-model="img"
          type="file"
        />

       <q-input
          label="Name"
          v-model="form.name"
          :rules="[val => (val && val.length > 0) || 'Name is required']"
        />
        <q-editor
          v-model="form.description"
          min-height="5rem"
        />

        <q-input
          label="Amount"
          v-model="form.amount"
          :rules="[val => !!val || 'Amount is required']"
          type="number"
        />

        <q-input
          label="Price"
          v-model="form.price"
          :rules="[val => !!val || 'Price is required']"
          prefix="R$"
        />
        <q-select
          v-model="form.category_id"
          :options="optionsCategory"
          label="Category"
          option-value="id"
          option-label="name"
          map-options
          emit-value
          :rules="[val => !!val || 'Category is required']"
        />

        <q-btn
          :label="isUpdate ? 'Update' : 'Save'"
          color="primary"
          class="full-width"
          rounded
          type="submit"
        />

        <q-btn
          label="Cancel"
          color="primary"
          class="full-width"
          rounded
          flat
          :to="{ name: 'product'}"
        />

      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'

export default defineComponent({
  name: 'PageForm',
  setup () {
    const table = 'products'
    const optionsCategory = ref([])
    const { post, getById, update, list, uploadImg } = useApi()
    const route = useRoute()
    const { notifyError, notifySuccess } = useNotify()
    const isUpdate = computed(() => route.params.id)

    let products = {}
    const form = ref({
      name: '',
      description: '',
      amount: 0,
      price: 0,
      category_id: '',
      img_url: ''
    })

    const img = ref([])

    onMounted(() => {
      handleListCategories()
      if (isUpdate.value) {
        handleGetProduct(isUpdate.value)
      }
    })

    const handleListCategories = async () => {
      optionsCategory.value = await list('categories')
    }

    const handleSubmit = async () => {
      try {
        if (img.value.length > 0) {
          const imgUrl = await uploadImg(img.value[0], 'product')
          form.value.img_url = imgUrl
        }
        if (isUpdate.value) {
          await update(table, form.value)
          notifySuccess('Update Successfully')
        } else {
          await post(table, form.value)
          notifySuccess('Saved Successfully')
        }
      } catch (error) {
        notifyError(error.message)
      }
    }
    const handleGetProduct = async (id) => {
      try {
        products = await getById(table, id)
        form.value = products
      } catch (error) {
        notifyError(error.message)
      }
    }
    return {
      handleSubmit,
      form,
      isUpdate,
      optionsCategory,
      img
    }
  }
})
</script>
