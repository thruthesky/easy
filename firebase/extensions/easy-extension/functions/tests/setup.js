const admin = require("firebase-admin");

function initFirebaseAdminSDK() {
  const serviceAccount = require("../service-account.json");
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL:
        "https://withcenter-test-2-default-rtdb.asia-southeast1.firebasedatabase.app",
    });
  }
  return admin;
}

async function createTestUser(options = {}) {
  // generate a random email address if one is not provided
  if (!options.email) {
    options.email = `${Math.random().toString(36).substring(7)}@test.com`;
  }

  password = options.password || "t~12345a";

  const user = await admin
    .auth()
    .createUser({ email: options.email, password });

  //
  return user;
}

exports.createTestUser = createTestUser;
exports.initFirebaseAdminSDK = initFirebaseAdminSDK;
