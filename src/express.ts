import http, { IncomingMessage, ServerResponse } from "http";
import { CallBackType, RoutType } from "./types/index.js";
import { compareUrl } from "./utils/urlHelper.js";

export const customExpress = () => {
  const routers: RoutType[] = [];

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

    listen(port: number | string) {
      const handler = (req: IncomingMessage, res: ServerResponse) => {
        for (const rout of routers) {
          if (req.method === rout.method) {
            const isSameUrl = compareUrl({
              reqUrl: req.url,
              routUrl: rout.url,
              isDynamicUrl: rout.isDynamicUrl,
            });

            if (isSameUrl) {
              return rout.callback(req, res);
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
