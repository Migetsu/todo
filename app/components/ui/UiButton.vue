<template>
  <button 
    class="ui-button" 
    :class="[
      `ui-button--${variant}`, 
      { 'ui-button--loading': loading },
      { 'ui-button--full': fullWidth }
    ]" 
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <UiSpinner v-if="loading" class="ui-button__spinner" />
    <span class="ui-button__content" :class="{ 'ui-button__content--hidden': loading }">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}>();

defineEmits(['click']);
</script>

<style lang="scss">
.ui-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  background-color: transparent;
  color: $color-text-primary;

  &--full {
    width: 100%;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &--primary {
    background-color: $color-primary;
    color: #fff;
    &:not(:disabled):hover {
      background-color: $color-primary-hover;
    }
    &:not(:disabled):active {
      background-color: $color-primary-active;
    }
  }

  &--secondary {
    border-color: $color-border;
    background-color: $color-bg-secondary;
    &:not(:disabled):hover {
      background-color: $color-bg-hover;
    }
  }

  &--danger {
    background-color: $color-danger;
    color: #fff;
    &:not(:disabled):hover {
      background-color: $color-danger-hover;
    }
    &:not(:disabled):active {
      background-color: $color-danger-active;
    }
  }

  &__spinner {
    position: absolute;
    width: 16px;
    height: 16px;
  }

  &__content {
    transition: opacity 0.15s ease-in-out;
    &--hidden {
      opacity: 0;
    }
  }
}
</style>
