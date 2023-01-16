import "dotenv/config";
import { server } from "./server.js";

const PORT = Number(process.env.PORT) || 3000;

process.on("uncaughtException", (error) => console.log(error));
process.on("SIGINT", () => process.exit());

server.listen(PORT);
