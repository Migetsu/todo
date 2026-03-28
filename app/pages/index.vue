<template>
  <div class="page-index container">
    <header class="header">
      <div class="header__left">
        <h1 class="header__title">To-Do List</h1>
        <p class="header__subtitle" v-if="authStore.user">
          Привет, {{ authStore.user.name }}!
        </p>
      </div>
      
      <div class="header__actions">
        <UiButton variant="primary" @click="openCreateModal">
          + Добавить задачу
        </UiButton>
        <UiButton variant="secondary" @click="authStore.logout">
          Выйти
        </UiButton>
      </div>
    </header>

    <main class="main-content">
      <TaskFilters />
      <TaskList @edit="openEditModal" />
    </main>

    <UiModal 
      v-model:isOpen="isModalOpen" 
      :title="editingTask ? 'Редактировать задачу' : 'Новая задача'"
      @close="closeModal"
    >
      <TaskForm 
        v-if="isModalOpen"
        :task="editingTask" 
        @submit="handleTaskSubmit"
        @cancel="closeModal"
      />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useTasksStore } from '../stores/tasks';
import type { Task } from '../types/task';

const authStore = useAuthStore();
const tasksStore = useTasksStore();

const isModalOpen = ref(false);
const editingTask = ref<Task | null>(null);

onMounted(() => {
  tasksStore.fetchTasks();
});

const openCreateModal = () => {
  editingTask.value = null;
  isModalOpen.value = true;
};

const openEditModal = (task: Task) => {
  editingTask.value = task;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  setTimeout(() => {
    editingTask.value = null;
  }, 300); // Ожидание окончания анимации закрытия, если она будет
};

const handleTaskSubmit = async (payload: any) => {
  let success = false;
  
  if (editingTask.value) {
    success = await tasksStore.updateTask(editingTask.value.id, payload);
  } else {
    success = await tasksStore.createTask(payload);
  }

  if (success) {
    closeModal();
  }
};
</script>

<style lang="scss">
.page-index {
  padding-top: 32px;
  padding-bottom: 32px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 32px;

  @media (min-width: $bp-tablet) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 4px 0;
  }
  
  &__subtitle {
    margin: 0;
    color: $color-text-secondary;
    font-size: 14px;
  }

  &__actions {
    display: flex;
    gap: 12px;
    width: 100%;

    @media (min-width: $bp-tablet) {
      width: auto;
    }
  }
}
</style>
