<template>
  <div class="ui-pagination" v-if="totalPages > 1">
    <button 
      class="ui-pagination__btn" 
      :disabled="modelValue === 1"
      @click="changePage(modelValue - 1)"
    >
      &larr;
    </button>
    
    <button 
      v-for="page in pages" 
      :key="page"
      class="ui-pagination__page"
      :class="{ 'ui-pagination__page--active': page === modelValue }"
      @click="changePage(page)"
    >
      {{ page }}
    </button>
    
    <button 
      class="ui-pagination__btn" 
      :disabled="modelValue === totalPages"
      @click="changePage(modelValue + 1)"
    >
      &rarr;
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: number;
  totalPages: number;
}>();

const emit = defineEmits(['update:modelValue']);

// Простая логика вывода страниц (показываем все, если их немного, иначе можно было бы усложнить)
const pages = computed(() => {
  const p = [];
  for (let i = 1; i <= props.totalPages; i++) {
    p.push(i);
  }
  return p;
});

const changePage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:modelValue', page);
  }
};
</script>

<style lang="scss">
.ui-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;

  &__btn, &__page {
    background: transparent;
    border: 1px solid $color-border;
    color: $color-text-primary;
    min-width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.15s ease-in-out;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      background-color: $color-bg-hover;
      border-color: $color-border-focus;
    }
  }

  &__page--active {
    background-color: $color-primary;
    color: #fff;
    border-color: $color-primary;
    &:hover {
      background-color: $color-primary;
      border-color: $color-primary;
    }
  }
}
</style>
