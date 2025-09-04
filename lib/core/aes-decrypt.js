const crypto = require("crypto");

const HEADER = "SENV";

function decryptBinary(encryptedBuffer, password) {
    if (!Buffer.isBuffer(encryptedBuffer)) throw new TypeError("encryptedBuffer must be a Buffer");
    if (typeof password !== "string") throw new TypeError("password must be a string");

    const header = encryptedBuffer.slice(0, 4).toString();
    if (header !== HEADER) throw new Error(".senv header invalid or corrupted");

    const salt = encryptedBuffer.slice(4, 20);
    const iv = encryptedBuffer.slice(20, 32);
    const authTag = encryptedBuffer.slice(32, 48); // 16-byte auth tag
    const data = encryptedBuffer.slice(48);

    const key = crypto.scryptSync(password, salt, 32);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);

    try {
        return Buffer.concat([decipher.update(data), decipher.final()]);
    } catch (err) {
        throw new Error("Decryption failed: data corrupted or wrong password");
    }
}

module.exports = decryptBinary;
