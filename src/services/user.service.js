const UserModel = require('./../models/user.model');

function createUser({ username, password }) {
  return UserModel.create({ username, password });
}

function getUserByUsernameAndPassword(username, password) {
  return UserModel.findOne({
    username,
    password
  })
}

function deleteUser(id) {
  return UserModel.findByIdAndDelete(id);
}

function updateUserBalance(username, balance) {
  return UserModel.findOneAndUpdate({ username }, { balance });
}

function getUserByUsername(username) {
  return UserModel.findOne({
    username
  })
}

module.exports = {
  createUser,
  getUserByUsernameAndPassword,
  deleteUser,
  updateUserBalance,
  getUserByUsername
};