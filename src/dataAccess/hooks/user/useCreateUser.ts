import { useMutation, useQueryClient } from 'react-query';
import { UserController, ICreateUser } from '../../controllers/user.controller';

const userController = new UserController();

export function useCreateUser() {
  const queryClient = useQueryClient();

  async function createUser(data: ICreateUser): Promise<void> {
    await userController.create(data);
    queryClient.invalidateQueries('getUsers');
  }

  return useMutation(createUser);
}