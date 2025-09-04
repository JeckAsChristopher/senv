const crypto = require("crypto");

const HEADER = "SENV";

function encryptBinary(dataBuffer, password) {
    if (!Buffer.isBuffer(dataBuffer)) throw new TypeError("dataBuffer must be a Buffer");
    if (typeof password !== "string") throw new TypeError("password must be a string");

    // Generate a random salt and derive key
    const salt = crypto.randomBytes(16);
    const key = crypto.scryptSync(password, salt, 32);

    // Generate random IV
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    const encrypted = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return Buffer.concat([Buffer.from(HEADER), salt, iv, authTag, encrypted]);
}

module.exports = encryptBinary;
