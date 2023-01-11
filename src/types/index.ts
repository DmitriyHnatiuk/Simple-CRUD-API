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

export type DataType = Record<string, UserType>;

export enum STATUS_CODE {
  POST = 201,
  PUT = 200,
  DELETE = 204,
}
