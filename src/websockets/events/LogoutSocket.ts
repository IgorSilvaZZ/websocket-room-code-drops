import { ILogoutConnection } from "../../dtos/ILogoutConnection";
import { ConnectionsService } from "../../services/ConnectionsService";

export default async ({ userId }: ILogoutConnection) => {
  const connectionsServices = ConnectionsService.getInstance();

  const connection = await connectionsServices.findConnectionUser(userId);

  if (connection) {
    await connectionsServices.updateSocketId(connection.id, "");
  }
};
