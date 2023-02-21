<template>
  <q-page padding>
       <div v-if="user">
      <div>Hello {{ user.email

 }}</div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import useAuthUser from 'src/composables/UseAuthUser'

export default defineComponent({
  name: 'PageMe',
  setup () {
    const { user } = useAuthUser()

    return {
      user
    }
  }
})
</script>
