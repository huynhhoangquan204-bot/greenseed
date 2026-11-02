module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [1, "always", ["web", "admin", "api", "shared", "ui", "ci", "deps", "infra", "docs"]],
  },
};
