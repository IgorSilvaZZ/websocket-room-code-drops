export interface ICreateMessage {
  text: string;
  userSenderId: string;
  userReceiverId?: string;
  roomId?: string;
}
