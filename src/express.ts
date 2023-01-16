import http, { IncomingMessage, ServerResponse } from "http";
import { CallBackType, RoutType } from "./types/index.js";
import { responseHandlerError } from "./utils/helpers.js";
import { compareUrl } from "./utils/urlHelper.js";

export const customExpress = () => {
  const routers: RoutType[] = [];
  const middlewares: ((
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void
  ) => void)[] = [];

  let count = 0;

  const middleware = (
    req: IncomingMessage,
    res: ServerResponse,
    callback: (req: IncomingMessage, res: ServerResponse) => void
  ) => {
    try {
      const _middleware = middlewares[count];

      const next = () => {
        count += 1;
        return middleware(req, res, callback);
      };

      if (_middleware) {
        return _middleware(req, res, next);
      }
      count = 0;
      return callback(req, res);
    } catch (err) {
      count = 0;
      responseHandlerError(res);
    }
  };

  return {
    get(url: string, callback: CallBackType) {
      routers.push({
        url,
        callback,
        method: "GET",
        isDynamicUrl: url.includes("/:"),
      });
    },

    post(url: string, callback: CallBackType) {
      routers.push({
        url,
        callback,
        method: "POST",
        isDynamicUrl: url.includes("/:"),
      });
    },

    put(url: string, callback: CallBackType) {
      routers.push({
        url,
        callback,
        method: "PUT",
        isDynamicUrl: url.includes("/:"),
      });
    },

    delete(url: string, callback: CallBackType) {
      routers.push({
        url,
        callback,
        method: "DELETE",
        isDynamicUrl: url.includes("/:"),
      });
    },

    use(
      callback?: (
        req: IncomingMessage,
        res: ServerResponse,
        next: () => void
      ) => void
    ) {
      if (typeof callback !== "function") {
        return;
      }

      middlewares.push(callback);
    },

    listen(port: number) {
      const handler = (req: IncomingMessage, res: ServerResponse) => {
        for (const rout of routers) {
          if (req.method === rout.method) {
            const isSameUrl = compareUrl({
              reqUrl: req.url,
              routUrl: rout.url,
              isDynamicUrl: rout.isDynamicUrl,
            });

            if (isSameUrl) {
              return middleware(req, res, rout.callback);
            }
          }
        }
      };

      const server = http
        .createServer(handler)
        .listen(port, () => console.log("Server started on port:", port));

      return server;
    },
  };
};
