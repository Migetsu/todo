import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'nuxt/app';

export const useAuthStore = defineStore('auth', () => {
  // Для SSR начальные значения null
  const token = ref<string | null>(null);
  const user = ref<{id: number, email: string, name: string, role: string} | null>(null);
  const router = useRouter();

  // Инициализация из localStorage только на клиенте
  if (import.meta.client) {
    token.value = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        user.value = JSON.parse(userStr);
      } catch (e) {}
    }
  }

  const setAuth = (newToken: string, userData: any) => {
    token.value = newToken;
    user.value = userData;
    if (import.meta.client) {
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    if (import.meta.client) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.push('/login');
  };

  return {
    token,
    user,
    setAuth,
    logout
  };
});
