export interface IUser {
  _id: string;
  name: string;
  lastname?: string;
  mainPicture?: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IChat {
  messagesWith: string;
  user: IUser;
  lastMessage?: string;
  date?: string;
}

export interface IMessage {
  date: string;
  _id: string;
  msg: string;
  receiver: string;
  sender: string;
}
