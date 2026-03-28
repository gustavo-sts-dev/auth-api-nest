import { z } from 'zod';

const usersSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  username: z.string(),
  role: z.enum(['user', 'admin']),
  email: z.string(),
  password: z.string(),
});

type Users = z.infer<typeof usersSchema>;

export { usersSchema, type Users };
