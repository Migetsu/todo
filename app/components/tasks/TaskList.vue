<template>
  <div class="task-list">
    <div v-if="tasksStore.loading && tasksStore.tasks.length === 0" class="task-list__placeholder">
      <UiSpinner size="lg" />
    </div>
    
    <div v-else-if="tasksStore.error" class="task-list__placeholder task-list__placeholder--error">
      <p>{{ tasksStore.error }}</p>
      <button class="task-list__retry" @click="tasksStore.fetchTasks()">Повторить</button>
    </div>

    <div v-else-if="tasksStore.tasks.length === 0" class="task-list__placeholder">
      <p v-if="tasksStore.searchQuery">По запросу <strong>"{{ tasksStore.searchQuery }}"</strong> задач не найдено</p>
      <p v-else-if="tasksStore.filterStatus === 'overdue'">Просроченных задач нет</p>
      <p v-else-if="tasksStore.filterStatus === 'completed'">Нет выполненных задач</p>
      <p v-else-if="tasksStore.filterStatus === 'active'">Нет активных задач</p>
      <p v-else>Задач пока нет. Создайте первую!</p>
    </div>

    <template v-else>
      <div class="task-list__items">
        <TaskItem 
          v-for="task in tasksStore.tasks" 
          :key="task.id" 
          :task="task" 
          @edit="$emit('edit', $event)" 
        />
      </div>

      <UiPagination 
        :modelValue="tasksStore.currentPage"
        :totalPages="tasksStore.totalPages"
        @update:modelValue="tasksStore.setPage($event)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useTasksStore } from '../../stores/tasks';

const emit = defineEmits(['edit']);
const tasksStore = useTasksStore();
</script>

<style lang="scss">
.task-list {
  background-color: $color-bg-main;
  border-radius: 8px;
  border: 1px solid $color-border;
  overflow: hidden;
  padding-bottom: 24px;

  &__placeholder {
    padding: 48px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    color: $color-text-secondary;
    text-align: center;

    &--error {
      color: $color-danger;
    }
  }

  &__retry {
    background: none;
    border: 1px solid $color-border;
    color: $color-text-primary;
    padding: 6px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      border-color: $color-primary;
      color: $color-primary;
    }
  }
}
</style>
