// Build tối giản cho website tĩnh: sao chép index.html vào dist/ để Netlify phục vụ.
// Khi chuyển sang Next.js hoặc Vite, thay bằng lệnh build của framework.
const fs = require("fs");
fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist", { recursive: true });
fs.copyFileSync("index.html", "dist/index.html");
console.log("web build ok -> dist/index.html");
