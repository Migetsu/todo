import { useAuthStore } from '../stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return; // Пропускаем проверку на сервере, так как токен в localStorage

  const authStore = useAuthStore();
  
  if (!authStore.token && to.path !== '/login') {
    return navigateTo('/login');
  }

  if (authStore.token && to.path === '/login') {
    return navigateTo('/');
  }
});
