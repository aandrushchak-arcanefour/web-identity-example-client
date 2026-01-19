<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import apiClient from '../services/api'
import { storeToRefs } from 'pinia'
let data = reactive({
  message: '',
})
let error = ref('')
onMounted(async () => {
  const { loading } = storeToRefs(useAuthStore())
  try {
    if (loading) {
      const response = await apiClient.get('api/hello')
      data.message = response.data?.message
    } else {
      data.message = 'Loading still...'
    }
  } catch (e: any) {
    error.value = e?.message
  }
})
</script>

<template>
  <div v-if="useAuthStore().loading == false">
    <Suspense v-if="!error"> Backend says {{ data }} </Suspense>
    <Suspense v-if="error"> Error occurred {{ error }} </Suspense>
  </div>
</template>
