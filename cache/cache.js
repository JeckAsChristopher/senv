"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const CACHE_DIR = path.join(__dirname, "cache-log");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

function generateId() {
    return crypto.randomBytes(8).toString("hex");
}

function setCache(data) {
    const id = generateId();
    const filename = path.join(CACHE_DIR, `cache${id}.log`);
    const cacheData = { id, data, timestamp: new Date().toISOString() };
    fs.writeFileSync(filename, JSON.stringify(cacheData, null, 2), "utf-8");
    return id;
}

function getCache(id) {
    const filename = path.join(CACHE_DIR, `cache${id}.log`);
    if (!fs.existsSync(filename)) return null;
    try { return JSON.parse(fs.readFileSync(filename, "utf-8")); } catch { return null; }
}

function getAllCache() {
    return fs.readdirSync(CACHE_DIR)
        .filter(f => f.startsWith("cache") && f.endsWith(".log"))
        .map(f => { try { return JSON.parse(fs.readFileSync(path.join(CACHE_DIR, f), "utf-8")); } catch { return null; } })
        .filter(Boolean);
}

const indexPath = path.join(__dirname, "../dist/index.js");
if (fs.existsSync(indexPath)) {
    const data = { action: "run", file: "dist/index.js" };
    setCache(data);
}

module.exports = { setCache, getCache, getAllCache };
