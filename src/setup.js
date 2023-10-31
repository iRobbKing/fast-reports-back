import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import pg from "pg";
import config from "./config.js";

const DB_PATH = path.join(process.cwd(), "db");
const INSTALL_FILE = "install.sql";
const STRUCTURE_FILE = "structure.sql";
const DATA_FILE = "data.sql";

async function readSqlFile(name) {
  return await fs.readFile(path.join(DB_PATH, name), "utf8");
}

function sqlCommands(sql) {
  return sql
    .split(";\n")
    .filter((s) => s.trim() !== "");
}

async function executeFile(client, name) {
  console.log(`Executing file ${name}.`);
  const sql = await readSqlFile(name);
  const commands = sqlCommands(sql);
  for (const command of commands)
    await client.query(command);
}

async function installDb() {
  const client = new pg.Client({ ...config.db, ...config.pg });
  await client.connect();
  await executeFile(client, INSTALL_FILE);
  await client.end();
}

async function prepareDb() {
  const client = new pg.Client(config.db);
  await client.connect();
  await executeFile(client, STRUCTURE_FILE);
  await executeFile(client, DATA_FILE);
  await client.end();
}

async function main() {
  try {
    await installDb();
    await prepareDb();
    console.log("Environment is ready.");
  } catch (error) {
    console.error(error);
  }
}

main();
