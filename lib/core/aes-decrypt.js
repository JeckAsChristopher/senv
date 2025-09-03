const crypto = require("crypto");

function decryptBinary(encryptedBuffer, password) {
    const header = encryptedBuffer.slice(0, 4).toString();
    if (header !== "SENV") throw new Error(".senv header invalid or corrupted");

    const iv = encryptedBuffer.slice(4, 20);
    const data = encryptedBuffer.slice(20);

    const key = crypto.scryptSync(password, "senv_salt", 32);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    return Buffer.concat([decipher.update(data), decipher.final()]);
}

module.exports = decryptBinary;
