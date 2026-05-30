import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const allowed = {
  STACK: ["backend", "frontend"],
  LEVELS: ["debug", "info", "warn", "error", "fatal"],
  PACKAGES_BY_STACK: {
    backend: [
      "cache",
      "controller",
      "cron_job",
      "db",
      "domain",
      "handler",
      "repositoy",
      "route",
      "service",
    ],
    frontend: ["api", "component", "hook", "page", "state", "style"],
  },
  PACKAGES_ALL: ["auth", "config", "middleware", "utils"],
};

function logger() {
  async function log(stack, level, pkg, message) {
    validate(stack, level, pkg);
    const payload = {
      stack,
      level,
      package: pkg,
      message,
    };

    try {
      const res = await axios.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      });
    } catch (err) {
      console.warn("Log API error : ", err.message);
    }
  }
  return log;
}

function validate(stack, level, pkg) {
  if (isEmpty(stack) || !allowed.STACK.includes(stack)) {
    throw new Error("Invalid stack");
  }
  if (isEmpty(level) || !allowed.LEVELS.includes(level)) {
    throw new Error("Invalid level");
  }
  const stackPackages = allowed.PACKAGES_BY_STACK[stack] || [];
  const allowedPackages = new Set([...allowed.PACKAGES_ALL, ...stackPackages]);

  if (isEmpty(pkg) || !allowedPackages.has(pkg)) {
    throw new Error("Invalid package");
  }
}

function isEmpty(value) {
  return value === undefined || value === null || value === "";
}

export default logger;
