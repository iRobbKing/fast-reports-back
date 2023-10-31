import path from "node:path";
import process from "node:process";
import pg from "pg";
import config from "./config.js";
import createFastifyServer from "./servers/fastify-server.js";
import { loadDir } from "./loader.js";
import createDb from "../lib/db.js";
import * as errors from "../lib/errors.js";
import * as hasher from "../lib/hasher.js";

const API_PATH = path.join(process.cwd(), "api");

const SERVERS = { fastify: createFastifyServer };

async function main() {
  const pool = new pg.Pool(config.db);
  const db = createDb(pool);
  const sandbox = { ...db, hasher, errors };
  const api = await loadDir(API_PATH, sandbox, config.sandbox);
  const server = await SERVERS[config.api.server](api, config);
  sandbox.logger = server.log;
  server.listen({ port: config.api.port });
}

main();
