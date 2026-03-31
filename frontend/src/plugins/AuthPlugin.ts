import Keycloak from 'keycloak-js'
import { useAuthStore } from '@/stores/auth'

export default {
  install: async (app: any) => {
    console.log('Starting auth plugin installation')
    let initOptions = {
      url: import.meta.env.VITE_KEYCLOAK_AUTH_SERVER_URL || 'http://localhost:8080',
      realm: import.meta.env.VITE_KEYCLOAK_REALM || '',
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || '',
      clientSecret: import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET || '',
    }
    const authObject = new Keycloak(initOptions)
    authObject.onTokenExpired = async () => {
      try {
        await authObject.updateToken(30)
        useAuthStore().commit('login', {
          idToken: authObject.idToken,
          token: authObject.token,
        })
      } catch (error) {
        authObject.login()
      }
    }
    
    // Redirect to complete-user-info only after fresh login (when OAuth fragments are present)
    authObject.onAuthSuccess = () => {
      // Check if we just came back from Keycloak login (has OAuth code in URL hash)
      const hasOAuthFragments = window.location.hash && 
        (window.location.hash.includes('code=') || window.location.hash.includes('state='))
      
      if (!hasOAuthFragments) {
        // Not a fresh login, just loading page with existing tokens
        return
      }
      
      const currentPath = window.location.pathname
      const isCompleteUserInfoPage = currentPath.includes('/complete-user-info')
      
      if (!isCompleteUserInfoPage) {
        console.log('[AuthPlugin] Fresh login detected, redirecting to complete-user-info')
        // Get URL without the OAuth fragments
        const currentUrl = window.location.origin + window.location.pathname + window.location.search
        const clientId = initOptions.clientId
        const webIdentityFrontendUrl = import.meta.env.VITE_WEB_IDENTITY_FRONTEND_URL || 'http://localhost:4005'
        
        const completeUserInfoUrl = `${webIdentityFrontendUrl}/complete-user-info?final_destination=${encodeURIComponent(currentUrl)}&clientId=${encodeURIComponent(clientId)}`
        console.log('[AuthPlugin] Redirecting to:', completeUserInfoUrl)
        window.location.href = completeUserInfoUrl
      }
    }
    
    let initializedKeycloak
    initializedKeycloak = await authObject.init({
      onLoad: 'login-required',
    })

    if (
      authObject.token &&
      authObject.idToken &&
      authObject.token != '' &&
      authObject.idToken != ''
    ) {
      console.log('Saving tokens to store')
      useAuthStore().commit('login', {
        idToken: authObject.idToken,
        token: authObject.token,
      })
    } else {
      useAuthStore().commit('logout')
    }
  },
}
