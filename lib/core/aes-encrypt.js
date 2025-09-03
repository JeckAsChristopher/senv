const crypto = require("crypto");

function encryptBinary(dataBuffer, password) {
    const key = crypto.scryptSync(password, "senv_salt", 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const encrypted = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
    return Buffer.concat([Buffer.from("SENV"), iv, encrypted]);
}

module.exports = encryptBinary;
