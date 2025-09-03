const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    fgGreen: "\x1b[32m",
    fgRed: "\x1b[31m",
    fgYellow: "\x1b[33m"
};

function colorText(text, color) {
    return (colors[color] || "") + text + colors.reset;
}

module.exports = { colorText, colors };
