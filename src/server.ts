import { randomUUID } from "crypto";
import { ServerResponse } from "http";
import { customExpress } from "./express.js";
import { BodyType, UserType } from "./types/index.js";
import { UsersData } from "./usersData/usersData.js";
import { randomUUIDRegex } from "./utils/const.js";
import { validateSchema } from "./utils/schema.js";
import { parseUrl } from "./utils/urlHelper.js";

const usersData = new UsersData();
export const server = customExpress();

// GET
const responseHandlerError = (res: ServerResponse) => {
  res.writeHead(500, {
    "Content-Type": "text/html",
  });
  res.end("Error: 500 Server Error");
};

server.get("/favicon.ico", (req, res) => {
  res.writeHead(200, { "Content-Type": "image/x-icon" });
  res.end();
});

server.get("/users", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(usersData.getData()));
});

server.get("/users/:userId", (req, res) => {
  const { userId } = parseUrl(req.url, "/users/:userId");

  if (userId && !userId.match(randomUUIDRegex)) {
    res.writeHead(400, { "Content-Type": "text/html" });
    return res.end("Error 400: Not valid user id");
  }

  const _user = usersData.getUser(userId);

  if (!_user) {
    res.writeHead(404, { "Content-Type": "text/html" });
    return res.end("Error 404: User not exist");
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(_user));
});

server.get("*", (req, res) => {
  res.writeHead(404, { "Content-Type": "text/html" });
  return res.end("Error 404: Page not found");
});

// POST
server.post("/users", (req, res) => {
  const params = <{ body: BodyType }>{ body: null };
  req.on("data", (data) => {
    try {
      params.body = { ...params.body, ...JSON.parse(data.toString()) };
    } catch (e) {
      return responseHandlerError(res);
    }
  });

  req.on("end", () => {
    try {
      const validateBody = validateSchema(params.body);
      if (validateBody.error || !validateBody.fields) {
        res.writeHead(400, { "Content-Type": "text/html" });
        return res.end(
          `Error 400: Not valid fields: ${validateBody.notValidFields.join(
            ","
          )}`
        );
      }
      const userId = randomUUID();
      usersData.addUser({ ...validateBody.fields, id: userId });
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(usersData.getData()));
    } catch (err) {
      return responseHandlerError(res);
    }
  });
});

// PUT
server.put("/users/:userId", (req, res) => {
  const params: { body: UserType } = {
    body: null,
  };

  const { userId } = parseUrl(req.url, "/users/:userId");
  if (userId && !userId.match(randomUUIDRegex)) {
    res.writeHead(400, { "Content-Type": "text/html" });
    return res.end("Error 400: Not valid user id");
  }
  req
    .on("data", (data) => {
      try {
        params.body = { ...params.body, ...JSON.parse(data.toString()) };
      } catch (e) {
        return responseHandlerError(res);
      }
    })
    .on("end", () => {
      try {
        const _user = usersData.getUser(userId);

        if (!_user) {
          res.writeHead(404, { "Content-Type": "text/html" });
          return res.end(`Error 404: User not exist`);
        }
        const validateBody = validateSchema(params.body);
        if (validateBody.error || !validateBody.fields) {
          res.writeHead(400, { "Content-Type": "text/html" });
          return res.end(
            `Error 400: Not contain required fields ${validateBody.notValidFields.join(
              ","
            )}`
          );
        }
        usersData.updateUser({ ...validateBody.fields, id: userId });
        res.writeHead(202, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(usersData.getUser(userId)));
      } catch (err) {
        responseHandlerError(res);
      }
    });
});

// DELETE
server.delete("/users/:userId", (req, res) => {
  try {
    const { userId } = parseUrl(req.url, "/users/:userId");
    const _user = usersData.getUser(userId);

    if (userId && !userId.match(randomUUIDRegex)) {
      res.writeHead(400, { "Content-Type": "text/html" });
      return res.end("Error 404: Not valid user id");
    }

    if (!_user) {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end("Error 404: User not exist");
    }

    usersData.deleteUser(userId);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end();
  } catch (err) {
    responseHandlerError(res);
  }
});
