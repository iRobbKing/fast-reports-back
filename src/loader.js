import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

export async function loadFile(filePath, sandbox, options) {
  const src = await fs.readFile(filePath, "utf8");
  const code = `"use strict";(${src});`;
  const script = new vm.Script(code, { ...options, lineOffset: -2 });
  const context = vm.createContext(sandbox);
  return script.runInContext(context, options);
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function kebabToCamelCase(str) {
  const parts = str.split("-");
  return parts[0] + parts.slice(1).map(capitalize).join("");
}

export async function loadDir(dirPath, sandbox, options) {
  const container = {};
  const items = await fs.readdir(dirPath, { withFileTypes: true });
  const promises = items.map(async (item) => {
    const itemPath = path.join(dirPath, item.name);
    if (item.isFile() && item.name.endsWith(".js")) {
      const name = path.basename(item.name, '.js');
      const serviceName = kebabToCamelCase(name);
      container[serviceName] = await loadFile(itemPath, sandbox, options);
    }
    if (item.isDirectory()) {
      const serviceName = kebabToCamelCase(item.name);
      container[serviceName] = await loadDir(itemPath, sandbox, options);
    }
  });
  await Promise.all(promises);
  return container;
}
