<template>
  <div class="task-filters">
    <div class="task-filters__tabs">
      <button 
        class="task-filters__tab" 
        :class="{ 'task-filters__tab--active': filterStatus === 'all' }"
        @click="tasksStore.setFilter('all')"
      >
        Все задачи
      </button>
      <button 
        class="task-filters__tab" 
        :class="{ 'task-filters__tab--active': filterStatus === 'active' }"
        @click="tasksStore.setFilter('active')"
      >
        Активные
      </button>
      <button 
        class="task-filters__tab" 
        :class="{ 'task-filters__tab--active': filterStatus === 'completed' }"
        @click="tasksStore.setFilter('completed')"
      >
        Выполненные
      </button>
      <button 
        class="task-filters__tab task-filters__tab--overdue" 
        :class="{ 'task-filters__tab--active': filterStatus === 'overdue' }"
        @click="tasksStore.setFilter('overdue')"
      >
        Просроченные
      </button>
    </div>

    <div class="task-filters__controls">
      <div class="task-filters__search">
        <UiInput 
          v-model="localSearch"
          placeholder="Поиск задач..."
        />
      </div>
      
      <div class="task-filters__sort">
        <UiSelect 
          :modelValue="sortBy"
          @update:modelValue="tasksStore.setSort($event as any)"
          :options="[
            { label: 'По дате (сначала новые)', value: 'date_desc' },
            { label: 'По дате (сначала старые)', value: 'date_asc' },
            { label: 'По названию (А-Я)', value: 'title' },
            { label: 'По приоритету', value: 'priority' }
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useTasksStore } from '../../stores/tasks';

const tasksStore = useTasksStore();
const filterStatus = computed(() => tasksStore.filterStatus);
const sortBy = computed(() => tasksStore.sortBy);

const localSearch = ref(tasksStore.searchQuery);

let timeout: any = null;
watch(localSearch, (val) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    tasksStore.setSearch(val);
  }, 400);
});
</script>

<style lang="scss">
.task-filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: $color-bg-main;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid $color-border;
  margin-bottom: 24px;

  @media (min-width: $bp-tablet) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  &__tabs {
    display: flex;
    gap: 8px;
    border-bottom: 1px solid $color-border;
    padding-bottom: 8px;

    @media (min-width: $bp-tablet) {
      border-bottom: none;
      padding-bottom: 0;
    }
  }

  &__tab {
    background: none;
    border: none;
    color: $color-text-secondary;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.15s ease-in-out;

    &:hover {
      background-color: $color-bg-hover;
      color: $color-text-primary;
    }

    &--active {
      background-color: rgba($color-primary, 0.1);
      color: $color-primary;
      
      &:hover {
        background-color: rgba($color-primary, 0.15);
      }
    }

    &--overdue {
      &.task-filters__tab--active {
        background-color: rgba($color-danger, 0.1);
        color: $color-danger;

        &:hover {
          background-color: rgba($color-danger, 0.15);
        }
      }
    }
  }

  &__controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
    
    @media (min-width: $bp-tablet) {
      flex-direction: row;
      align-items: center;
    }
  }
  
  &__search {
    min-width: 0;

    @media (min-width: $bp-tablet) {
      width: 250px;
    }
    
    .ui-input-wrapper {
      margin-bottom: 0; 
    }
  }

  &__sort {
    min-width: 0;

    @media (min-width: $bp-tablet) {
      width: 220px;
    }
    
    .ui-select-wrapper {
      margin-bottom: 0;
    }
  }
}
</style>
