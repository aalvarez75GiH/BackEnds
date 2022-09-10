const admin = require("firebase-admin");
var serviceAccount = require("../../../serviceAccountKey.json");

// ************* Firebase configuration
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
// **************************************

const getAllUsers = async () => {
  return await db
    .collection("usersDetails")
    .get()
    .then((data) => data);
};

const getUserById = async (id) => {
  return await db
    .collection("usersDetails")
    .doc(id)
    .get()
    .then((userDetail) => userDetail.data());
};

const createUser = async (user) => {
  const { name, address, mobile } = user;
  return await db.collection("usersDetails").doc(`/${Date.now()}/`).create({
    id: Date.now(),
    name: name,
    mobile: mobile,
    address: address,
  });
};

const updateUser = async (user, id) => {
  const { name, address, mobile } = user;
  return await db.collection("usersDetails").doc(id).update({
    name: name,
    mobile: mobile,
    address: address,
  });
};

const deleteUser = async (id) => {
  return await db.collection("usersDetails").doc(id).delete();
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
