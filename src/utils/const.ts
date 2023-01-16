export const randomUUIDRegex =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

export class WorkerPool {
  private workers: { [key: string]: number };
  getWorkers() {
    return this.workers;
  }
  getWorkerPort(id: number) {
    return this.workers[id];
  }
  setWorker(newWorker: { [key: string]: number }) {
    return (this.workers = { ...this.workers, ...newWorker });
  }
  setWorkers(worker: { [key: string]: number }) {
    return (this.workers = worker);
  }
}
