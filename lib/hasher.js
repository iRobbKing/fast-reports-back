import { Buffer } from "node:buffer";
import crypto from "node:crypto";
import util from "node:util";

const randomBytes = util.promisify(crypto.randomBytes);
const scrypt = util.promisify(crypto.scrypt);

function scryptParamsToPrefix({ N, r, p, maxmem }) {
  return `scrypt$N=${N},r=${r},p=${p},maxmem=${maxmem}`;
}

const SCRYPT_PARAMS = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const SCRYPT_PREFIX = scryptParamsToPrefix(SCRYPT_PARAMS);

const SALT_LEN = 32;
const KEY_LEN = 64;

export async function hashPassword(password) {
  const salt = await randomBytes(SALT_LEN);
  const hash = await scrypt(password, salt, KEY_LEN, SCRYPT_PARAMS);
  return serializeHash(hash, salt);
}

export async function compareHash(password, passwordHash) {
  const { params, salt, hash } = deserializeHash(passwordHash);
  const hashedPassword = await scrypt(password, salt, hash.length, params);
  return crypto.timingSafeEqual(hashedPassword, hash);
}

function serializeHash(hash, salt) {
  const saltString = salt.toString("base64").split("=")[0];
  const hashString = hash.toString("base64").split("=")[0];
  return `${SCRYPT_PREFIX}$${saltString}$${hashString}`;
}

function deserializeHash(hashedPassword) {
  const [name, options, salt64, hash64] = hashedPassword.split("$");
  if (name !== "scrypt") throw new Error("Only scrypt is supported.");
  const params = parseOptions(options);
  const salt = Buffer.from(salt64, "base64");
  const hash = Buffer.from(hash64, "base64");
  return { params, salt, hash };
}

function parseOptions(options) {
  const items = options
    .split(",")
    .map((item) => {
      const [key, value] = item.split("=");
      return [key, parseInt(value)];
    });
  return Object.fromEntries(items);
}
