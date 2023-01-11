import { IncomingMessage, ServerResponse } from "http";
import { usersData } from "../server.js";
import { STATUS_CODE } from "../types/index.js";
import { UserType } from "./../types/index";

export const responseHandlerError = (res: ServerResponse) => {
  res.writeHead(500, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify({ message: "Server Error" }));
};

export const createResponse = (res: ServerResponse) => ({
  send: (message: string) => res.end(message),

  img: (statusCode: number, message?: string) => {
    res.writeHead(statusCode, { "Content-Type": "image/x-icon" });
    res.end(message);
  },

  json: (
    statusCode: number,
    message: { [key: string]: string } | UserType | UserType[]
  ) => {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(message));
  },

  html: (statusCode: number, message: string) => {
    res.writeHead(statusCode, { "Content-Type": "text/html" });
    res.end(message);
  },
});

export const middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
) => {
  const { method } = req;

  if (method === "POST" || method === "PUT" || method === "DELETE") {
    res.on("finish", () => {
      if (method && res.statusCode === STATUS_CODE[method]) {
        process.send({
          type: "sync_data",
          data: usersData.getData(),
          id: process.pid,
        });
      }
    });
  }
  return next();
};
