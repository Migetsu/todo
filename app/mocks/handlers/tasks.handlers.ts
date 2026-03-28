import { http, HttpResponse, delay } from 'msw';
import { tasks, getNextTaskId } from '../data/tasks.data';
import { users } from '../data/users.data';

const checkAuth = (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1] || '';
  const userId = parseInt(token);
  return users.find(u => u.id === userId) || null;
};

export const tasksHandlers = [
  http.get('/api/tasks', async ({ request }) => {
    await delay(300);
    const user = checkAuth(request);
    
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || 'all';
    const sortBy = url.searchParams.get('sortBy') || 'date_desc';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '5');

    let result = [...tasks];

    if (search) {
      result = result.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    }

    if (status === 'active') {
      result = result.filter(t => !t.isCompleted);
    } else if (status === 'completed') {
      result = result.filter(t => t.isCompleted);
    } else if (status === 'overdue') {
      const now = new Date().getTime();
      result = result.filter(t => !t.isCompleted && new Date(t.dueDate).getTime() < now);
    }

    // Сортировка
    result.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'date_asc') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (sortBy === 'date_desc') return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      if (sortBy === 'priority') {
        const pA = a.priority === 'important' ? 1 : 0;
        const pB = b.priority === 'important' ? 1 : 0;
        return pB - pA;
      }
      return 0;
    });

    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      tasks: paginated,
      total: result.length,
      page,
      limit,
      totalPages: Math.ceil(result.length / limit)
    });
  }),

  http.post('/api/tasks', async ({ request }) => {
    await delay(300);
    const user = checkAuth(request);
    if (!user) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body: any = await request.json();
    if (!body.title || !body.dueDate) {
      return HttpResponse.json({ message: 'Bad Request' }, { status: 400 });
    }

    const newTask = {
      id: getNextTaskId(),
      title: body.title,
      description: body.description || '',
      dueDate: body.dueDate,
      isCompleted: false,
      priority: body.priority || 'normal',
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask as any);
    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.put('/api/tasks/:id', async ({ request, params }) => {
    await delay(300);
    const user = checkAuth(request);
    if (!user) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const id = parseInt(params.id as string);
    const body: any = await request.json();

    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return HttpResponse.json({ message: 'Not Found' }, { status: 404 });

    const task = tasks[index];
    if (!task) return HttpResponse.json({ message: 'Not Found' }, { status: 404 });

    if (task.createdBy !== user.id && user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    tasks[index] = { ...task, ...body, id };
    return HttpResponse.json(tasks[index]);
  }),

  http.delete('/api/tasks/:id', async ({ request, params }) => {
    await delay(300);
    const user = checkAuth(request);
    if (!user) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const id = parseInt(params.id as string);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return HttpResponse.json({ message: 'Not Found' }, { status: 404 });

    const task = tasks[index];
    if (!task) return HttpResponse.json({ message: 'Not Found' }, { status: 404 });

    if (task.createdBy !== user.id && user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    tasks.splice(index, 1);
    return HttpResponse.json({ success: true });
  })
];
