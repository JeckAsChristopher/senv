#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { promptPassword, checkEnvFile, encryptBinary } = require("../lib/core/link");
const { colorText } = require("../lib/utils/colors");
const { logInfo } = require("../lib/utils/utils");

const args = process.argv.slice(2);

if (args.includes("--test")) {
    require("./test-senv");
    process.exit(0);
}

(async () => {
    logInfo(colorText("Finding .env in current directory...", "fgYellow"));
    const envPath = checkEnvFile();
    logInfo(colorText(".env Found..", "fgGreen"));

    try {
        const password = await promptPassword();
        const data = fs.readFileSync(envPath);
        const encrypted = encryptBinary(data, password);
        fs.writeFileSync(path.resolve(".senv"), encrypted);
        logInfo(colorText(".env encrypted and locked on .senv", "fgGreen"));
    } catch (err) {
        console.error(colorText(err.message, "fgRed"));
        process.exit(1);
    }
})();
