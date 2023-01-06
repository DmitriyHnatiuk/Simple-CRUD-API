import "dotenv/config";
import { server } from "./server.js";

const PORT = process.env.PORT || 3000;

process.once("uncaughtException", (error) => {
  console.log("error", error);
});

server.listen(PORT);
