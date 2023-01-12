# Simple-CRUD-API

[Assignment task_3](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)

# This is a REST API example application

Implemented endpoint api/users
In `package.json` we have some basic commands:

`start:prod` start server(for production).
`start:dev` start server(for development).  
`start:multi`: start server with multiple ports and load Load Balancing.
`test` runs a simplistic test and the API.

and other necessary commands like:

`view:test_cover` shows coverage test in chrome browser(run after command test)
`test:dev` for writing test
`lint` for check code on eslint

## Don't forgat Install npm packages

`npm install` or (`npm i`)

## Run the app

If you want to set the port for the server, you need to add a `.env` file with a port number (for example, `PORT=4000`) if the file does not exist, the server will run on port `3000`.
`npm run start:prod` or `npm run start:dev`

## Run the tests

`npm run test`

# REST API

The REST API to the example app is described below.

## Get list of Users

### Request

`GET api/users`

    curl -i -H 'Accept: application/json' http://localhost:4000/api/users

`or`(without `.env` file)

    curl -i -H 'Accept: application/json' http://localhost:3000/api/users

<details>
<summary><h4>Response</h4></summary>
<pre>
HTTP/1.1 200 OK
Content-Type: application/json
Date: Thu, 01 Jan 2023 01:00:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked
</br>
[]
</pre>
</details>

## Create a new User

### Request

`POST /api/users`

    curl -i -H 'Accept: application/json' -d '{"name":"Alex","age":20,"hobbies":[]}' http://localhost:4000/api/users

`or`(without `.env` file)

    curl -i -H 'Accept: application/json' -d '{"name":"Alex","age":20,"hobbies":[]}' http://localhost:3000/api/users

<details>
<summary><h4>Response</h4></summary>
<pre>
HTTP/1.1 201 Created
Content-Type: application/json
Date: Thu, 01 Jan 2023 01:00:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked
</br>
[{"name":"Alex","age":20,"hobbies":[],"id":"99844815-a09b-462e-92d1-7cabdef66ffc"}]
</pre>
</details>

## Get a specific User

### Request

`GET /api/users/:id`

    curl -i -H 'Accept: application/json' http://localhost:4000/api/users/99844815-a09b-462e-92d1-7cabdef66ffc

`or`(without `.env` file)

    curl -i -H 'Accept: application/json' http://localhost:3000/api/users/99844815-a09b-462e-92d1-7cabdef66ffc

<details>
<summary><h4>Response</h4></summary>
<pre>
HTTP/1.1 200 OK
Content-Type: application/json
Date: Thu, 01 Jan 2023 01:00:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked
</br>
{"name":"Alex","age":22,"hobbies":[],"id":"99844815-a09b-462e-92d1-7cabdef66ffc"}
</pre>
</details>

## Get a non-existent User

### Request

`GET /api/users/:id`

    curl -i -H 'Accept: application/json' http://localhost:4000/api/users/99844815-a09b-462e-92d1-4cabdef66ffc

`or`(without `.env` file)

    curl -i -H 'Accept: application/json' http://localhost:3000/api/users/some_id

<details>
<summary><h4>Response</h4></summary>
<pre>
HTTP/1.1 404 Not Found
Content-Type: application/json
Date: Thu, 01 Jan 2023 01:00:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked
</br>
{"message":"User not exist"}
</pre>

<code>or</code> if <code>id</code> not valid

<pre>
HTTP/1.1 400 Bad Request
Content-Type: application/json
Date: Thu, 01 Jan 2023 01:00:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked
<br>
{"message":"Not valid user id"}
</pre>
</details>

## Change a User state

### Request

`PUT api/users/:id`

curl -i -H 'Accept: application/json' -X PUT -d '{"name":"Alex","age":25,"hobbies":[]}' http://localhost:4000/api/users/99844815-a09b-462e-92d1-7cabdef66ffc

`or`(without `.env` file)

curl -i -H 'Accept: application/json' -X PUT -d '{"name":"Alex","age":25,"hobbies":[]}' http://localhost:3000/api/users/99844815-a09b-462e-92d1-7cabdef66ffc

<details>
<summary><h4>Response</h4></summary>
<pre>
HTTP/1.1 200 OK
Content-Type: application/json
Date: Thu, 01 Jan 2023 01:00:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked
</br>
{"name":"Alex","age":25,"hobbies":[],"id":"99844815-a09b-462e-92d1-7cabdef66ffc"}
</pre>
</details>

## Attempt to change a Users using invalid params

### Request

`PUT /api/users/:id`

curl -i -H 'Accept: application/json' -X PUT -d '{"name":"Alex","age":"string"}' http://localhost:4000/api/users/99844815-a09b-462e-92d1-7cabdef66ffc

`or`(without `.env` file)

curl -i -H 'Accept: application/json' -X PUT -d '{"name":"Alex","age":"string"}' http://localhost:3000/api/users/99844815-a09b-462e-92d1-7cabdef66ffc

<details>
<summary><h4>Response</h4></summary>
<pre>
HTTP/1.1 400 Bad Request
Content-Type: application/json
Date: Thu, 01 Jan 2023 01:00:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked
</br>
{"message":"Not contain required fields age,hobbies"}
</pre>
</details>

## Delete a User

### Request

`DELETE /api/users/:id`

curl -i -H 'Accept: application/json' -X DELETE http://localhost:4000/api/users/99844815-a09b-462e-92d1-7cabdef66ffc

`or`(without `.env` file)

curl -i -H 'Accept: application/json' -X DELETE http://localhost:3000/api/users/99844815-a09b-462e-92d1-7cabdef66ffc

<details>
<summary><h4>Response</h4></summary>
<pre>
HTTP/1.1 204 No Content
Content-Type: application/json
Date: Thu, 01 Jan 2023 01:00:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5
</br>
</pre>
</details>

## Try to delete same User again

### Request

`DELETE /api/users/:id`

curl -i -H 'Accept: application/json' -X DELETE http://localhost:4000/api/users/99844815-a09b-462e-92d1-7cabdef66ffc

`or`(without `.env` file)

curl -i -H 'Accept: application/json' -X DELETE http://localhost:3000/api/users/99844815-a09b-462e-92d1-7cabdef66ffc

<details>
<summary><h4>Response</h4></summary>
<pre>
HTTP/1.1 404 Not Found
Content-Type: application/json
Date: Thu, 01 Jan 2023 01:00:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked
</br>
{"message":"User not exist"}
</pre>
</details>

## Get deleted User

### Request

`GET /api/users/:id`

    curl -i -H 'Accept: application/json' http://localhost:4000/api/users/99844815-a09b-462e-92d1-7cabdef66ffc

`or`(without `.env` file)

    curl -i -H 'Accept: application/json' http://localhost:3000/api/users/99844815-a09b-462e-92d1-7cabdef66ffc

<details>
<summary><h4>Response</h4></summary>
<pre>
HTTP/1.1 404 Not Found
Content-Type: application/json
Date: Thu, 01 Jan 2023 01:00:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked
</br>
{"message":"User not exist"}
</pre>
</details>
