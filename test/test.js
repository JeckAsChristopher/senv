const http = require("http");
const {
    checkSenvFile,
    promptPassword,
    decryptBinary,
    validateSenv
} = require("../lib/core/configure");
const fs = require("fs");
const path = require("path");
const { colorText } = require("../lib/utils/colors");

(async () => {
    const senvPath = checkSenvFile();
    if (!senvPath) {
        console.log(colorText(".senv not found!", "fgRed"));
        process.exit(1);
    }

    try {
        console.log(colorText("Configuring .senv...", "fgYellow"));
        const password = await promptPassword(false);
        const encrypted = fs.readFileSync(senvPath);

        // Validate header
        validateSenv(encrypted);

        // Decrypt into memory
        const decrypted = decryptBinary(encrypted, password);

        // For demo: parse ENV_TEST variable
        const envStr = decrypted.toString("utf-8").trim();
        const envParts = envStr.split("=");
        const ENV_TEST = envParts[1] || "undefined";

        console.log(colorText(".senv decrypted successfully!", "fgGreen"));

        // Create HTTP server
        const server = http.createServer((req, res) => {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(`Hello! ENV_TEST=${ENV_TEST}\n`);
        });

        const PORT = 3000;
        server.listen(PORT, () => {
            console.log(colorText(`Server running on http://localhost:${PORT}`, "fgGreen"));
        });

        // Wipe memory on exit
        process.on("exit", () => {
            decrypted.fill(0);
        });

    } catch (err) {
        console.error(colorText("Failed to configure SENV: " + err.message, "fgRed"));
        process.exit(1);
    }
})();
