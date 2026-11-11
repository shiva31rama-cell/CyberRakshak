const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { hashPasswordBeforeSave } = require("../services/auth/passwordService");

test("password save helper hashes a changed password and preserves login compatibility", async () => {
  const password = "synthetic-test-password";
  const user = {
    password,
    isModified: (field) => field === "password",
  };

  await hashPasswordBeforeSave(user);

  assert.notEqual(user.password, password);
  assert.equal(await bcrypt.compare(password, user.password), true);
});

test("password save helper leaves unchanged passwords alone", async () => {
  const password = "existing-bcrypt-hash-placeholder";
  const user = {
    password,
    isModified: () => false,
  };

  await hashPasswordBeforeSave(user);

  assert.equal(user.password, password);
});

test("user model accepts long email domain suffixes", () => {
  const user = new User({
    name: "Synthetic Reporter",
    email: "reporter@example.technology",
    password: "synthetic-password",
  });

  assert.equal(user.validateSync(), undefined);
});
