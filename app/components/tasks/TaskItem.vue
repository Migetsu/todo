<template>
  <div class="task-item" :class="{ 'task-item--completed': task.isCompleted }">
    <div class="task-item__main">
      <div 
        class="task-item__checkbox"
        :class="{ 'task-item__checkbox--checked': task.isCompleted }"
        @click="toggleComplete"
      >
        <svg v-if="task.isCompleted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <div class="task-item__content">
        <h4 class="task-item__title" @dblclick="startInlineEdit" :title="!isEditing ? 'Двойной клик для быстрого переименования' : ''">
          <input 
            v-if="isEditing" 
            v-model="inlineTitle" 
            ref="titleInput"
            class="task-item__inline-input"
            @blur="saveInlineEdit" 
            @keyup.enter="saveInlineEdit"
            @keyup.esc="cancelInlineEdit"
          />
          <template v-else>
            {{ task.title }}
            <span v-if="task.priority === 'important'" class="task-item__badge">Важно</span>
          </template>
        </h4>
        <div class="task-item__meta">
          <span class="task-item__date">Дедлайн: {{ formatDate(task.dueDate) }}</span>
        </div>
      </div>
    </div>

    <div class="task-item__actions">
      <template v-if="canManage">
        <button class="task-item__btn" @click="$emit('edit', task)" title="Редактировать всё">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        </button>
        <button class="task-item__btn task-item__btn--danger" @click="handleDelete" title="Удалить">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import type { Task } from '../../types/task';
import { useTasksStore } from '../../stores/tasks';
import { useAuthStore } from '../../stores/auth';

const props = defineProps<{
  task: Task;
}>();

const emit = defineEmits(['edit']);
const tasksStore = useTasksStore();
const authStore = useAuthStore();

const canManage = computed(() =>
  authStore.user?.role === 'admin' || authStore.user?.id === props.task.createdBy
);

const isEditing = ref(false);
const inlineTitle = ref('');
const titleInput = ref<HTMLInputElement | null>(null);

const formatDate = (isoStr: string) => {
  const d = new Date(isoStr);
  return d.toLocaleDateString('ru-RU', { 
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const toggleComplete = () => {
  tasksStore.updateTask(props.task.id, { isCompleted: !props.task.isCompleted });
};

const handleDelete = () => {
  tasksStore.deleteTask(props.task.id);
};

const startInlineEdit = async () => {
  inlineTitle.value = props.task.title;
  isEditing.value = true;
  await nextTick();
  titleInput.value?.focus();
};

const saveInlineEdit = () => {
  if (!isEditing.value) return; // предотвращаем двойное срабатывание blur+enter
  isEditing.value = false;
  if (inlineTitle.value.trim() && inlineTitle.value !== props.task.title) {
    tasksStore.updateTask(props.task.id, { title: inlineTitle.value.trim() });
  }
};

const cancelInlineEdit = () => {
  isEditing.value = false;
  inlineTitle.value = props.task.title;
};
</script>

<style lang="scss">
.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: $color-bg-main;
  border-bottom: 1px solid $color-border;
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: $color-bg-hover;
  }

  &--completed {
    .task-item__title {
      text-decoration: line-through;
      color: $color-text-secondary;
    }
  }

  &__main {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-width: 0; // Для обрезки текста
  }

  &__checkbox {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 2px solid $color-border-focus;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s ease-in-out;
    color: #fff;

    &:hover {
      border-color: $color-primary;
    }

    &--checked {
      background-color: $color-primary;
      border-color: $color-primary;
    }
    
    svg {
      width: 14px;
      height: 14px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
    @include text-truncate;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__inline-input {
    background: transparent;
    border: none;
    border-bottom: 1px solid $color-primary;
    color: inherit;
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
    padding: 0;
    margin: 0;
    width: 100%;
    outline: none;
  }

  &__badge {
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 700;
    background-color: rgba($color-danger, 0.2);
    color: $color-danger;
    padding: 2px 6px;
    border-radius: 4px;
  }

  &__meta {
    font-size: 12px;
    color: $color-text-secondary;
  }

  &__actions {
    display: flex;
    gap: 8px;
    opacity: 0.5;
    transition: opacity 0.15s ease-in-out;
    padding-left: 16px;

    @media (max-width: $bp-tablet) {
      opacity: 1;
    }
  }

  &:hover &__actions {
    opacity: 1;
  }

  &__btn {
    background: none;
    border: none;
    color: $color-text-secondary;
    cursor: pointer;
    padding: 6px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease-in-out;

    &:hover {
      background-color: $color-bg-secondary;
      color: $color-primary;
    }

    &--danger:hover {
      color: $color-danger;
    }
  }
}
</style>
