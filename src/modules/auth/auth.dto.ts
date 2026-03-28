import { usersSchema } from '@modules/users/users.dto';
import { z } from 'zod';

const createUserSchema = usersSchema.omit({
  id: true,
  role: true,
  name: true,
});

const loginUsersSchema = usersSchema.omit({
  id: true,
  role: true,
  name: true,
  username: true,
});

const refreshSchema = usersSchema.pick({
  id: true,
  role: true,
});

type CreateUsersDTO = z.infer<typeof createUserSchema>;
type LoginUsersDTO = z.infer<typeof loginUsersSchema>;
type RefreshTokenDTO = z.infer<typeof refreshSchema>;

export {
  type CreateUsersDTO,
  type LoginUsersDTO,
  type RefreshTokenDTO,
  createUserSchema,
  loginUsersSchema,
  refreshSchema,
};
