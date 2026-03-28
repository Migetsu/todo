<template>
  <Teleport to="body">
    <div v-if="isOpen" class="ui-modal-overlay" @click.self="close">
      <div class="ui-modal">
        <div class="ui-modal__header">
          <h3 class="ui-modal__title">{{ title }}</h3>
          <button class="ui-modal__close" @click="close">&times;</button>
        </div>
        <div class="ui-modal__body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  title: string;
}>();

const emit = defineEmits(['update:isOpen', 'close']);

const close = () => {
  emit('update:isOpen', false);
  emit('close');
};

// Блокировка скролла при открытом модальном окне
watch(() => props.isOpen, (val) => {
  if (import.meta.client) {
    if (val) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
});
</script>

<style lang="scss">
.ui-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.ui-modal {
  width: 100%;
  max-width: 500px;
  background-color: $color-bg-main;
  border-radius: 8px;
  border: 1px solid $color-border;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid $color-border;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }

  &__close {
    background: none;
    border: none;
    color: $color-text-secondary;
    font-size: 24px;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    
    &:hover {
      color: $color-text-primary;
    }
  }

  &__body {
    padding: 20px;
  }
}
</style>
