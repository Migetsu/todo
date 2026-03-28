<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-card__title">To-Do List</h1>
      <p class="login-card__subtitle">Управляйте задачами эффективно</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <UiInput 
          v-model="email" 
          type="email" 
          placeholder="Email" 
          :error="emailError"
        />
        <UiInput 
          v-model="password" 
          type="password" 
          placeholder="Пароль" 
          :error="passwordError"
        />

        <div v-if="serverError" class="login-form__error">
          {{ serverError }}
        </div>

        <UiButton 
          type="submit" 
          variant="primary" 
          fullWidth
          :loading="loading"
        >
          Войти
        </UiButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useNuxtApp, useRouter } from 'nuxt/app';

const email = ref('');
const password = ref('');
const emailError = ref('');
const passwordError = ref('');
const serverError = ref('');
const loading = ref(false);

const { $api } = useNuxtApp();
const authStore = useAuthStore();
const router = useRouter();

const validate = () => {
  let isValid = true;
  emailError.value = '';
  passwordError.value = '';
  
  if (!email.value) {
    emailError.value = 'Введите email';
    isValid = false;
  }
  if (!password.value) {
    passwordError.value = 'Введите пароль';
    isValid = false;
  }
  return isValid;
};

const handleLogin = async () => {
  if (!validate()) return;

  loading.value = true;
  serverError.value = '';

  try {
    const res = await $api.post('/auth/login', {
      email: email.value,
      password: password.value
    });

    authStore.setAuth(res.data.token, res.data.user);
    // Для более надежного редиректа
    if (import.meta.client) {
        window.location.href = '/';
    } else {
        router.push('/');
    }
  } catch (err: any) {
    serverError.value = err?.response?.data?.message || 'Ошибка входа';
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-bg-secondary;
  padding: 16px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background-color: $color-bg-main;
  padding: 40px 32px;
  border-radius: 8px;
  border: 1px solid $color-border;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

  &__title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  &__subtitle {
    font-size: 14px;
    color: $color-text-secondary;
    margin-bottom: 32px;
  }
}

.login-form {
  &__error {
    color: $color-danger;
    font-size: 14px;
    margin-bottom: 16px;
  }
  
  &__hint {
    margin-top: 16px;
    font-size: 12px;
    color: $color-text-secondary;
  }
}
</style>
