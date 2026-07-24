const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..", "..");
const clientDir = path.join(repoRoot, "client");
const clientPackageJson = path.join(clientDir, "package.json");

if (!fs.existsSync(clientPackageJson)) {
    console.log("[build-client] client/package.json not found, skipping client build.");
    process.exit(0);
}

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

const run = (args, label) => {
    console.log(`[build-client] ${label}: ${npmCmd} ${args.join(" ")}`);

    const result = spawnSync(npmCmd, args, {
        cwd: clientDir,
        stdio: "inherit",
        // Windows requires a shell to execute npm.cmd reliably.
        shell: process.platform === "win32",
    });

    if (result.error) {
        console.error(`[build-client] ${label} failed:`, result.error.message);
        process.exit(1);
    }

    if (result.status !== 0) {
        process.exit(result.status || 1);
    }
};

// Vite and its React plugin are devDependencies, but they are still required
// to produce the production bundle. Render may otherwise omit them when
// NODE_ENV=production.
run(["install", "--include=dev"], "Installing client dependencies");
run(["run", "build"], "Building client");
