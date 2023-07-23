const assert = require("assert");
const { db, a, b, c, d, tempChatRoomData, admin } = require("./setup");

// load firebase-functions-test SDK
const firebase = require("@firebase/testing");

describe("Chat room leave", () => {
    it("Chat room leave - failure test: b removes a", async () => {

        // create a chat room
        const ref = await admin()
            .collection("easychat")
            .add(tempChatRoomData({ master: a.uid, users: [a.uid, b.uid] }));
        
        snapshot = await ref.get();

        // console.log(snapshot.data());


        // chat room leave
        await firebase.assertFails(
            db(b).collection("easychat").doc(ref.id).update({
                users: firebase.firestore.FieldValue.arrayRemove(a.uid)
            })
        )
    });
    it("Chat room leave - failure test: b removes a from users araay that has manu muliple users.", async () => {

        // create a chat room
        const ref = await admin()
            .collection("easychat")
            .add(tempChatRoomData({ master: a.uid, users: [a.uid, b.uid, c.uid, d.uid, a.uid, b.uid, b.uid, b.uid, b.uid, c.uid, c.uid, c.uid, c.uid] }));
        
        snapshot = await ref.get();

        // console.log(snapshot.data());


        // chat room leave
        await firebase.assertFails(
            db(b).collection("easychat").doc(ref.id).update({
                users: firebase.firestore.FieldValue.arrayRemove(a.uid)
            })
        )
    });
    it("Chat room leave - failure test: b removes b from users araay that has manu muliple users.", async () => {

        // create a chat room
        const ref = await admin()
            .collection("easychat")
            .add(tempChatRoomData({ master: a.uid, users: [a.uid, b.uid, c.uid, d.uid, b.uid, b.uid ] }));
        
        // oldSanpshot = await ref.get();

        // console.log("Before ---> ", oldSanpshot.data());


        // chat room leave
        await firebase.assertSucceeds(
            db(b).collection("easychat").doc(ref.id).update({
                users: firebase.firestore.FieldValue.arrayRemove(b.uid)
            })
        )

        // afterSnapshot = await ref.get();
        // console.log("After ---> ", afterSnapshot.data());
    });


    it("Master can remove a user from user list", async () => {

        // create a chat room
        const ref = await admin()
            .collection("easychat")
            .add(tempChatRoomData({ master: a.uid, users: [a.uid, b.uid, c.uid, d.uid, b.uid, b.uid ] }));
        
        // chat room leave
        await firebase.assertSucceeds(
            db(a).collection("easychat").doc(ref.id).update({
                users: firebase.firestore.FieldValue.arrayRemove(b.uid)
            })
        )
    });
    it("Moderator can remove a user from user list", async () => {

        // create a chat room
        const ref = await admin()
            .collection("easychat")
            .add(tempChatRoomData({ master: a.uid, moderators: [d.uid], users: [a.uid, b.uid, c.uid, d.uid, b.uid, b.uid ] }));
        
        // chat room leave
        await firebase.assertSucceeds(
            db(d).collection("easychat").doc(ref.id).update({
                users: firebase.firestore.FieldValue.arrayRemove(b.uid)
            })
        )
    });
    


    it("Moderator can remove a user from user list", async () => {

        // create a chat room
        const ref = await admin()
            .collection("easychat")
            .add(tempChatRoomData({ master: a.uid, moderators: [d.uid], users: [a.uid, b.uid, c.uid, d.uid, b.uid, b.uid ] }));
        
        // chat room leave
        await firebase.assertFails(
            db(d).collection("easychat").doc(ref.id).update({
                users: firebase.firestore.FieldValue.arrayRemove(a.uid)
            })
        )
    });

});

