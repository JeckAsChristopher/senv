const fs = require("fs");
const path = require("path");
const readline = require("readline");
const encryptBinary = require("./aes-encrypt");
const decryptBinary = require("./aes-decrypt");
const { wipeMemory } = require("./antimem");

async function promptPassword(confirm = true) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true
    });

    function question(query, hidden = false) {
        return new Promise(resolve => {
            if (!hidden) return rl.question(query, resolve);
            const stdin = process.stdin;
            process.stdout.write(query);
            stdin.setRawMode(true);
            let value = "";
            stdin.on("data", char => {
                char = char.toString();
                if (char === "\r" || char === "\n") {
                    stdin.setRawMode(false);
                    process.stdout.write("\n");
                    stdin.removeAllListeners("data");
                    resolve(value);
                } else if (char === "\u0003") {
                    process.exit();
                } else {
                    value += char;
                }
            });
        });
    }

    const password = await question("Enter Password: ", true);
    if (!confirm) return password;
    const confirmPass = await question("Confirm Password: ", true);
    if (password !== confirmPass) throw new Error("Passwords do not match");
    rl.close();
    return password;
}

function checkEnvFile() {
    const envPath = path.resolve(".env");
    if (!fs.existsSync(envPath)) throw new Error(".env not found");
    return envPath;
}

function checkSenvFile() {
    const senvPath = path.resolve(".senv");
    return fs.existsSync(senvPath) ? senvPath : null;
}

function restoreEnvFromSenv(password) {
    const senvPath = checkSenvFile();
    if (!senvPath) throw new Error(".senv not found");

    const encrypted = fs.readFileSync(senvPath);
    const decrypted = decryptBinary(encrypted, password);
    fs.writeFileSync(path.resolve(".env"), decrypted);
    wipeMemory(decrypted);
    return true;
}

function validateSenv(encryptedBuffer) {
    if (!Buffer.isBuffer(encryptedBuffer)) throw new Error("Invalid buffer");
    const header = encryptedBuffer.slice(0, 4).toString();
    if (header !== "SENV") throw new Error(".senv header invalid or corrupted");
    return true;
}

module.exports = {
    promptPassword,
    checkEnvFile,
    encryptBinary,
    decryptBinary,
    wipeMemory,
    checkSenvFile,
    restoreEnvFromSenv,
    validateSenv
};
