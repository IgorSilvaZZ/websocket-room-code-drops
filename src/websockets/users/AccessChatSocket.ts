import { UsersServices } from "../../services/UsersService";

interface IAccessChat {
  username: string;
}

export default async (
  { username }: IAccessChat,
  callback: CallableFunction
) => {
  const usersServices = new UsersServices();

  const user = await usersServices.create(username);

  callback(user);
};
