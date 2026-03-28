<template>
  <div class="task-form">
    <form @submit.prevent="handleSubmit">
      <UiInput 
        v-model="form.title" 
        label="Название задачи *" 
        placeholder="Например, Купить продукты"
        :error="errors.title"
      />
      
      <div class="ui-input-wrapper">
        <label class="ui-input-wrapper__label">Описание</label>
        <textarea 
          v-model="form.description"
          class="ui-input ui-textarea"
          rows="3"
          placeholder="Подробное описание задачи..."
        ></textarea>
      </div>

      <UiInput 
        v-model="form.dueDate" 
        type="datetime-local"
        label="Дедлайн *" 
        :min="minDateTime"
        :error="errors.dueDate"
      />

      <UiSelect 
        v-model="form.priority"
        label="Приоритет"
        :options="[
          { label: 'Обычный', value: 'normal' },
          { label: 'Важный', value: 'important' }
        ]"
      />

      <div v-if="task" class="task-form__status">
        <label>
          <input type="checkbox" v-model="form.isCompleted" />
          Задача выполнена
        </label>
      </div>

      <div class="task-form__actions">
        <UiButton type="button" variant="secondary" @click="$emit('cancel')">Отмена</UiButton>
        <UiButton type="submit" variant="primary">
          {{ task ? 'Сохранить' : 'Добавить' }}
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { Task, TaskPriority } from '../../types/task';

const props = defineProps<{
  task?: Task | null;
}>();

const emit = defineEmits(['submit', 'cancel']);

const form = ref({
  title: '',
  description: '',
  dueDate: '',
  priority: 'normal' as TaskPriority,
  isCompleted: false
});

const errors = ref({
  title: '',
  dueDate: ''
});

const formatDateForInput = (isoDate: string) => {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
};

// Минимальная дата - текущий момент (округляем до минут)
const minDateTime = ref(formatDateForInput(new Date().toISOString()));

onMounted(() => {
  if (props.task) {
    form.value = {
      title: props.task.title,
      description: props.task.description,
      dueDate: formatDateForInput(props.task.dueDate),
      priority: props.task.priority,
      isCompleted: props.task.isCompleted
    };
  } else {
    // Пытаемся восстановить черновик
    const draft = localStorage.getItem('task_draft');
    if (draft) {
      try {
        form.value = JSON.parse(draft);
      } catch (e) { }
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      form.value.dueDate = formatDateForInput(tomorrow.toISOString());
    }
  }
});

// Автосохранение черновика при изменениях (только для новых задач)
watch(form, (newVal) => {
  if (!props.task) {
    localStorage.setItem('task_draft', JSON.stringify(newVal));
  }
}, { deep: true });

const validate = () => {
  let isValid = true;
  errors.value = { title: '', dueDate: '' };

  if (!form.value.title.trim()) {
    errors.value.title = 'Обязательное поле';
    isValid = false;
  }
  
  if (!form.value.dueDate) {
    errors.value.dueDate = 'Обязательное поле';
    isValid = false;
  } else if (new Date(form.value.dueDate) < new Date()) {
    errors.value.dueDate = 'Дедлайн не может быть в прошлом';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (!validate()) return;
  
  const payload = {
    ...form.value,
    dueDate: new Date(form.value.dueDate).toISOString()
  };

  if (!props.task) {
    localStorage.removeItem('task_draft'); // Очищаем черновик после успешного сабмита
  }

  emit('submit', payload);
};
</script>

<style lang="scss">
.task-form {
  
  .ui-textarea {
    resize: vertical;
    min-height: 80px;
    font-family: inherit;
  }

  &__status {
    margin-bottom: 24px;
    
    label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 14px;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid $color-border;
  }
}
</style>
