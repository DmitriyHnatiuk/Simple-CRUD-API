import supertest from "supertest";
import { server } from "../server.js";
import { UserType } from "./../types/index";

const _server = server.listen(1234);

const newUser = {
  name: "new name",
  age: 20,
  hobbies: ["readings"],
};

const NOT_EXIST_USER_ID = "3f8097a6-71ef-7777-8888-01c3df246d45";

describe("Test", () => {
  afterAll(() => _server.close());
  const serverStart = supertest(_server);

  describe("GET", () => {
    test("GET users should return status code 200", async () => {
      await serverStart.get("/users").expect(200);
      await serverStart.get("/favicon.ico").expect(200);
    });

    test("GET all users data should be array", async () => {
      const response = await serverStart.get("/users");
      const data = await response.body;
      expect(Array.isArray(data)).toBe(true);
    });

    test("GET user by wrong id should return 400|404", async () => {
      await serverStart.get("/users/someId").expect(400);
      await serverStart.get(`/users/${NOT_EXIST_USER_ID}`).expect(404);
    });

    test("GET 404 page", async () => {
      await serverStart.get(`/*`).expect(404);
    });
  });

  describe("POST", () => {
    test("POST create new user should return status code 201", async () => {
      await serverStart
        .post("/users")
        .send({ ...newUser, id: 12 })
        .expect(201);
    });

    test("POST with wrong data should return status code 500|400", async () => {
      await serverStart.post("/users").send("data").expect(500);
      await serverStart
        .post("/users")
        .send({ ...newUser, age: {} })
        .expect(400);
    });
  });

  describe("PUT", () => {
    test("GET and PUT first users should return arr with changed user", async () => {
      const response = await serverStart.get("/users");

      const { body } = await response;

      const [firstUser, ...rest] = body;
      const { id: userId } = firstUser;

      await serverStart.get(`/users/${userId}`).expect(200);

      await serverStart.put(`/users/${userId}`).send("data").expect(500);

      const putResponse = await serverStart
        .put(`/users/${userId}`)
        .send(newUser);

      const { body: putBody } = putResponse;

      expect(putBody.name).toBe(newUser.name);
    });
    test("PUT user by wrong user id should return 400|404", async () => {
      await serverStart.put(`/users/${NOT_EXIST_USER_ID}`).expect(404);
      await serverStart.put(`/users/someId`).expect(400);
    });
  });

  describe("DELETE", () => {
    test("POST and DELETE users should return user not exist", async () => {
      const response = await serverStart.post(`/users`).send(newUser);
      const { body } = response;

      expect(body.includes(newUser)).toBe(false);

      const { id: userId, ...user } = body.find(
        (user: UserType) =>
          user.name === newUser.name && user.age === newUser.age
      );

      expect(user).toEqual(newUser);
      await serverStart.delete(`/users/${userId}`).expect(200);
      const { body: data } = await serverStart.get("/users");
      expect(data.find((user: UserType) => user.id === userId)).toBe(undefined);
    });

    test("DELETE user by wrong user id should return 400|404", async () => {
      await serverStart.delete(`/users/${NOT_EXIST_USER_ID}`).expect(404);
      await serverStart.delete(`/users/someId`).expect(400);
    });
  });
});
