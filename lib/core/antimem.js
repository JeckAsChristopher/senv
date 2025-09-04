"use strict";

/**
 * Securely wipes memory of sensitive data.
 * Supports Buffer, TypedArray, and regular Array.
 *
 * @param {Buffer|TypedArray|Array} data - The memory to wipe
 * @param {number} [passes=1] - Number of overwrite passes (default 1)
 */
function wipeMemory(data, passes = 1) {
    if (!data || typeof passes !== "number" || passes < 1) {
        throw new TypeError("Invalid arguments for wipeMemory");
    }

    const length = data.length;

    if (Buffer.isBuffer(data)) {
        for (let i = 0; i < passes; i++) {
            crypto.randomFillSync(data);
        }
        data.fill(0);
    } else if (ArrayBuffer.isView(data)) {
        for (let i = 0; i < passes; i++) {
            for (let j = 0; j < length; j++) {
                data[j] = Math.floor(Math.random() * 256);
            }
        }
        data.fill(0);
    } else if (Array.isArray(data)) {
        for (let i = 0; i < passes; i++) {
            for (let j = 0; j < length; j++) {
                data[j] = 0;
            }
        }
    } else {
        throw new TypeError("wipeMemory: unsupported data type");
    }

    return true;
}

module.exports = { wipeMemory };
