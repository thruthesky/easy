// load firebase-functions-test SDK
const firebase = require("@firebase/testing");

// Firebase project that the tests connect to.
const TEST_PROJECT_ID = "withcenter-test-2";

const a = { uid: "uid-A", email: "apple@gmail.com" };
const b = { uid: "uid-B", email: "banana@gmail.com" };
const c = { uid: "uid-C", email: "cherry@gmail.com" };
const d = { uid: "uid-D", email: "durian@gmail.com" };

// Connect to Firestore with a user permission.
function db(auth = null) {
  return firebase
    .initializeTestApp({ projectId: TEST_PROJECT_ID, auth: auth })
    .firestore();
}

// Connect to Firestore with admin permssion. This will pass all the rules.
function admin() {
  return firebase
    .initializeAdminApp({ projectId: TEST_PROJECT_ID })
    .firestore();
}

/**
 * Returns fake chat room data
 *
 *
 * By default,
 *  - createdAt: new Date()
 *  - group: false
 *  - open: false
 *  - no uid.
 *
 *
 * @param {*} options
 * @returns returns chat room data
 *
 * @example
 *  - tempChatRoomData({ master: a.uid, users: [a.uid, b.uid] }
 */
function tempChatRoomData(options = {}) {
  return Object.assign(
    {},
    {
      createdAt: new Date(),
      group: false,
      open: false,
    },
    options
  );
}

/**
 *
 * @param {*} masterAuth
 * @param {*} options
 * @returns chat room ref
 * @example
 * - const roomRef = await createChatRoom(a, { master: a.uid, users: [a.uid, b.uid] });
 */
function createChatRoom(masterAuth, options = {}) {
  return db(masterAuth).collection("easychat").add(tempChatRoomData(options));
}

async function createOpenGroupChat(masterAuth) {
  return await createChatRoom(a, {
    master: a.uid,
    users: [a.uid],
    open: true,
    group: true,
  });
}

/**
 * Chat invite
 *
 *
 * @param {*} a the auth of the user who invites
 * @param {*} b the auth of the user who is being invited.
 */
async function invite(a, b, roomId) {
  await db(a)
    .collection("easychat")
    .doc(roomId)
    .update({ users: firebase.firestore.FieldValue.arrayUnion(b.uid) });
}

/**
 * Chat block
 *
 *
 * @param {*} blockerAuth the auth of the user who blocks
 * @param {*} blockedAuth the auth of the user who is being blocked.
 */
async function block(blockerAuth, blockedAuth, roomId) {
  await db(blockerAuth)
    .collection("easychat")
    .doc(roomId)
    .update({
      blockedUsers: firebase.firestore.FieldValue.arrayUnion(blockedAuth.uid),
    });
}

exports.db = db;
exports.admin = admin;
exports.tempChatRoomData = tempChatRoomData;
exports.createChatRoom = createChatRoom;
exports.a = a;
exports.b = b;
exports.c = c;
exports.d = d;
exports.TEST_PROJECT_ID = TEST_PROJECT_ID;
exports.createOpenGroupChat = createOpenGroupChat;
exports.invite = invite;
exports.block = block;
