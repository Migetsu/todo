import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import type { Task, TaskStatus, TaskPriority } from '../types/task';

export const useTasksStore = defineStore('tasks', () => {
  const { $api } = useNuxtApp();

  const tasks = ref<Task[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  type StatusFilter = 'all' | 'active' | 'completed' | 'overdue';
  type SortFilter = 'date_desc' | 'date_asc' | 'title' | 'priority';

  const filterStatus = ref<StatusFilter>('all');
  const sortBy = ref<SortFilter>('date_desc');
  const searchQuery = ref('');
  const currentPage = ref(1);
  const totalPages = ref(1);
  const limit = 5;

  const fetchTasks = async () => {
    loading.value = true;
    error.value = null;

    try {
      const query = {
        search: searchQuery.value,
        status: filterStatus.value,
        sortBy: sortBy.value,
        page: currentPage.value,
        limit
      };

      const res = await $api('/tasks', { params: query });
      tasks.value = res.data.tasks;
      total.value = res.data.total;
      totalPages.value = res.data.totalPages;
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to fetch tasks';
    } finally {
      loading.value = false;
    }
  };

  const setPage = (page: number) => {
    currentPage.value = page;
    fetchTasks();
  };

  const setFilter = (status: StatusFilter) => {
    filterStatus.value = status;
    currentPage.value = 1;
    fetchTasks();
  };

  const setSort = (sort: SortFilter) => {
    sortBy.value = sort;
    currentPage.value = 1;
    fetchTasks();
  };

  const setSearch = (query: string) => {
    searchQuery.value = query;
    currentPage.value = 1;
    fetchTasks();
  };

  const createTask = async (payload: { title: string; description?: string; dueDate: string; priority: TaskPriority }) => {
    try {
      await $api.post('/tasks', payload);
      await fetchTasks();
      return true;
    } catch (e) {
      return false;
    }
  };

  const updateTask = async (id: number, payload: Partial<Task>) => {
    try {
      await $api.put(`/tasks/${id}`, payload);
      await fetchTasks(); // перезапрашиваем для консистентности (может пропасть из-за фильтров)
      return true;
    } catch (e: any) {
      if (e?.response?.status === 403) {
        alert('У вас нет прав для редактирования этой задачи.');
      }
      return false;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      if (confirm('Удалить задачу?')) {
        await $api.delete(`/tasks/${id}`);
        
        // Если удалили последнюю задачу на странице, переходим на предыдущую
        if (tasks.value.length === 1 && currentPage.value > 1) {
          currentPage.value--;
        }
        await fetchTasks();
      }
      return true;
    } catch (e: any) {
      if (e?.response?.status === 403) {
        alert('У вас нет прав для удаления этой задачи.');
      }
      return false;
    }
  };

  return {
    tasks,
    total,
    loading,
    error,
    currentPage,
    totalPages,
    filterStatus,
    sortBy,
    searchQuery,
    fetchTasks,
    setPage,
    setFilter,
    setSort,
    setSearch,
    createTask,
    updateTask,
    deleteTask
  };
});
