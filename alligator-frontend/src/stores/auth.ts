import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useAuthStore = defineStore('storeAuth', () => {
  const user = reactive({
    keycloak: {
      idToken: null,
      accessToken: null,
    },
  })
  let loading = ref(true)
  return {
    loading,
    user,
    setLoading: (value: boolean) => {
      loading.value = value
    },
    getLoading: () => {
      return loading
    },
    commit: (event: string, data?: any) => {
      if (event === 'login') {
        user.keycloak = {
          idToken: data.idToken,
          accessToken: data.token,
        }
      } else {
        user.keycloak = {
          idToken: null,
          accessToken: null,
        }
      }
    },
  }
})
