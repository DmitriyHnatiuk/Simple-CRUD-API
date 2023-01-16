import { randomUUID } from "crypto";
import { customExpress } from "./express.js";
import { BodyType, UserType } from "./types/index.js";
import { UsersData } from "./usersData/usersData.js";
import { randomUUIDRegex } from "./utils/const.js";
import { createResponse, responseHandlerError } from "./utils/helpers.js";
import { validateSchema } from "./utils/schema.js";
import { parseUrl } from "./utils/urlHelper.js";

export const usersData = new UsersData();
export const server = customExpress();

// GET
server.get("/favicon.ico", (req, res) => createResponse(res).img(200));

server.get("/api/users", (req, res) =>
  createResponse(res).json(200, usersData.getUsers())
);

server.get("/api/users/:userId", (req, res) => {
  const { userId } = parseUrl(req.url, "/api/users/:userId");

  const _res = createResponse(res);

  if (userId && !userId.match(randomUUIDRegex)) {
    return _res.json(400, { message: "Not valid user id" });
  }

  const _user = usersData.getUser(userId);

  if (!_user) {
    return _res.json(404, { message: "User not exist" });
  }
  return _res.json(200, _user);
});

server.get("*", (req, res) =>
  createResponse(res).json(404, { message: "Page not found" })
);

// POST
server.post("/api/users", (req, res) => {
  const _res = createResponse(res);
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
        return _res.json(400, {
          message: `Not valid fields: ${validateBody.notValidFields.join(",")}`,
        });
      }
      const userId = randomUUID();
      usersData.addUser({ ...validateBody.fields, id: userId });
      return _res.json(201, usersData.getUsers());
    } catch (err) {
      return responseHandlerError(res);
    }
  });
});

// PUT
server.put("/api/users/:userId", (req, res) => {
  const _res = createResponse(res);
  const params: { body: UserType } = {
    body: null,
  };

  const { userId } = parseUrl(req.url, "/api/users/:userId");
  if (userId && !userId.match(randomUUIDRegex)) {
    return _res.json(400, { message: "Not valid user id" });
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
          return _res.json(404, { message: "User not exist" });
        }
        const validateBody = validateSchema(params.body);
        if (validateBody.error || !validateBody.fields) {
          return _res.json(400, {
            message: `Not contain required fields ${validateBody.notValidFields.join(
              ","
            )}`,
          });
        }
        usersData.updateUser({ ...validateBody.fields, id: userId });
        return _res.json(200, usersData.getUser(userId));
      } catch (err) {
        responseHandlerError(res);
      }
    });
});

// DELETE
server.delete("/api/users/:userId", (req, res) => {
  try {
    const _res = createResponse(res);
    const { userId } = parseUrl(req.url, "/api/users/:userId");
    const _user = usersData.getUser(userId);

    if (userId && !userId.match(randomUUIDRegex)) {
      return _res.json(400, { message: "Not valid user id" });
    }

    if (!_user) {
      return _res.json(404, { message: "User not exist" });
    }

    usersData.deleteUser(userId);
    return _res.json(204, {});
  } catch (err) {
    responseHandlerError(res);
  }
});
