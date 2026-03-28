<template>
  <div class="ui-select-wrapper">
    <label v-if="label" class="ui-select-wrapper__label">{{ label }}</label>
    <select 
      class="ui-select" 
      :value="modelValue"
      :disabled="disabled"
      @change="onChange"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
export interface SelectOption {
  label: string;
  value: string | number;
}

const props = defineProps<{
  modelValue: string | number;
  options: SelectOption[];
  label?: string;
  disabled?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>

<style lang="scss">
.ui-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;

  &__label {
    font-size: 14px;
    color: $color-text-secondary;
  }
}

.ui-select {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid $color-border;
  border-radius: 6px;
  background-color: $color-bg-secondary;
  color: $color-text-primary;
  cursor: pointer;
  appearance: none; // Убираем стандартную стрелочку в некоторых браузерах
  
  // Добавляем кастомную стрелочку
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0a0a0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  padding-right: 32px;

  &:focus {
    border-color: $color-primary;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
