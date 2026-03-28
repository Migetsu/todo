import { http, HttpResponse, delay } from 'msw';
import { users } from '../data/users.data';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await delay(500); // Эмуляция сети
    
    const body: any = await request.json();
    const { email, password } = body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return HttpResponse.json({ message: 'Неверные данные для входа' }, { status: 401 });
    }

    // Возвращаем ID пользователя в качестве "токена", как в ТЗ
    const { password: _, ...userWithoutPassword } = user;
    
    return HttpResponse.json({
      token: String(user.id),
      user: userWithoutPassword
    });
  })
];
