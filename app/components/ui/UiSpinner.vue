<template>
  <div class="ui-spinner" :class="[ `ui-spinner--${size}` ]"></div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md'
});
</script>

<style lang="scss">
.ui-spinner {
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spinner-rotate 0.8s linear infinite;

  &--sm {
    width: 16px;
    height: 16px;
    border-width: 2px;
  }
  
  &--md {
    width: 24px;
    height: 24px;
    border-width: 3px;
  }

  &--lg {
    width: 32px;
    height: 32px;
    border-width: 4px;
  }
}

@keyframes spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
