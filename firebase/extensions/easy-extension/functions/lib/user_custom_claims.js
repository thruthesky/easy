async function setCustomClaims(uid, claims) {
  await admin.auth().setCustomUserClaims(uid, claims);
  return uid;
}

async function getCustomClaims(uid) {
  const user = await admin.auth().getUser(uid);
  return user.customClaims;
}

module.exports = setCustomClaims;
