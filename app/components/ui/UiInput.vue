<template>
  <div class="ui-input-wrapper">
    <label v-if="label" class="ui-input-wrapper__label">{{ label }}</label>
    <input 
      class="ui-input" 
      :class="{ 'ui-input--error': error }"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onInput"
    />
    <span v-if="error" class="ui-input-wrapper__error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}>(), {
  type: 'text'
});

const emit = defineEmits(['update:modelValue']);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<style lang="scss">
.ui-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;

  &__label {
    font-size: 14px;
    color: $color-text-secondary;
  }

  &__error {
    font-size: 12px;
    color: $color-danger;
  }
}

.ui-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid $color-border;
  border-radius: 6px;
  background-color: $color-bg-secondary;
  color: $color-text-primary;
  transition: border-color 0.15s ease-in-out;

  &:focus {
    border-color: $color-primary;
  }

  &--error {
    border-color: $color-danger;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
