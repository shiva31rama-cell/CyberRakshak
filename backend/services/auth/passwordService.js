const bcrypt = require("bcryptjs");

async function hashPasswordBeforeSave(user) {
  if (!user.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
}

module.exports = { hashPasswordBeforeSave };
