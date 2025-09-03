const fs = require("fs");
const path = require("path");
const { decryptBinary, promptPassword } = require("../lib/core/link");
const { colorText } = require("../lib/utils/colors");

(async () => {
    const senvPath = path.resolve(".senv");
    const envPath = path.resolve(".env");

    if (!fs.existsSync(senvPath)) {
        console.log(colorText(".senv not found!", "fgRed"));
        process.exit(1);
    }

    try {
        console.log(colorText("Testing .senv integrity...", "fgYellow"));
        const password = await promptPassword(false);
        const decrypted = decryptBinary(fs.readFileSync(senvPath), password);

        // Restore to .env
        fs.writeFileSync(envPath, decrypted);
        console.log(colorText(".senv successfully decrypted and restored to .env", "fgGreen"));
    } catch (err) {
        console.error(colorText("SENV test failed: " + err.message, "fgRed"));
        process.exit(1);
    }
})();
