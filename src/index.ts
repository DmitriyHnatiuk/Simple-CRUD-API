import "dotenv/config";
import { server } from "./server.js";

const PORT = Number(process.env.PORT) || 3000;

process.once("uncaughtException", (error) => console.log(error));
process.once("SIGINT", () => process.exit());

server.listen(PORT);
