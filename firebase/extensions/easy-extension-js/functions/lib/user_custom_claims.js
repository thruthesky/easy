const admin = require("firebase-admin");

/**
 *
 * @param {*} uid
 * @param {*} claims
 * @returns
 */
async function setCustomClaims(uid, claims) {
  await admin.auth().setCustomUserClaims(uid, claims);
  return uid;
}

/**
 *
 * @param {*} uid
 * @returns
 */
async function getCustomClaims(uid) {
  const user = await admin.auth().getUser(uid);
  // console.log(user);
  return user.customClaims;
}

exports.setCustomClaims = setCustomClaims;
exports.getCustomClaims = getCustomClaims;
