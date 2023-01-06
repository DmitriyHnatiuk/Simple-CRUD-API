import { IncomingMessage, ServerResponse } from "http";

export type UserType = {
  id: string;
  name: string;
  age: number;
  hobbies: string[];
};

export type BodyType = {
  name: string;
  age: number;
  hobbies: string[];
};

export type CallBackType = (req: IncomingMessage, res: ServerResponse) => void;

export type RoutType = {
  url: string;
  callback: CallBackType;
  method: string;
  isDynamicUrl: boolean;
};
