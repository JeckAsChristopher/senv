function wipeMemory(buffer) {
    if (Buffer.isBuffer(buffer)) buffer.fill(0);
}

module.exports = { wipeMemory };
