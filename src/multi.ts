import cluster from "cluster";
import "dotenv/config";
import http, { IncomingMessage, ServerResponse } from "http";
import { cpus } from "os";
import { server, usersData } from "./server.js";
import { DataType } from "./types/index";
import { WorkerPool } from "./utils/const.js";
import { middleware } from "./utils/helpers.js";

const totalCPUs = cpus().length;

const PORT = Number(process.env.PORT) || 3000;

process.on("uncaughtException", (error) => console.log(error));
process.on("SIGINT", () => process.exit());

function updateData(data: DataType, id: number) {
  for (const worker of Object.values(cluster.workers)) {
    if (worker.process.pid !== id) {
      worker.send({
        type: "update",
        data,
      });
    }
  }
}

if (cluster.isPrimary) {
  const workersPool = new WorkerPool();
  const workersPort: number[] = [];
  let currentServer = 0;

  for (let i = 1; i <= totalCPUs; i++) {
    const _port = PORT + i;
    workersPort.push(_port);
    const worker = cluster.fork({ PORT: _port });
    workersPool.setWorker({ [worker.process.pid]: _port });

    worker.on("message", (msg) => {
      if (msg.type === "sync_data") {
        updateData(msg.data, msg.id);
      }
    });
  }

  const handler = (req: IncomingMessage, res: ServerResponse) => {
    const { method, headers, url: path } = req;
    const port = workersPort[currentServer];

    const options = {
      port,
      path,
      method,
      headers,
    };

    currentServer + 1 < totalCPUs ? (currentServer += 1) : (currentServer = 0);
    req.pipe(
      http
        .request(options, (_res) => {
          res.statusCode = _res.statusCode;
          _res.pipe(res);
        })
        .on("error", () => handler(req, res))
    );
  };

  http
    .createServer(handler)
    .listen(PORT, () => console.log("Server started on port:", PORT));

  cluster.on("exit", (worker, code, signal) => {
    const { [worker.process.pid]: _port, ...rest } = workersPool.getWorkers();
    const _worker = cluster.fork({ PORT: _port });
    workersPool.setWorkers({ ...rest, [_worker.process.pid]: _port });

    worker.on("message", (msg) => {
      if (msg.type === "sync_data") {
        updateData(msg.data, msg.id);
      }
    });
  });
} else {
  process.on("message", (msg: { type: string; data: DataType }) => {
    if (msg.type === "update") {
      usersData.updateData(msg.data);
    }
  });

  server.use(middleware);

  server.listen(PORT);
}
