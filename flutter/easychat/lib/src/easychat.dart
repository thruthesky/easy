import 'dart:io';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:easychat/easychat.dart';
import 'package:file_picker/file_picker.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class EasyChat {
  // The instance of the EasyChat singleton.
  static EasyChat? _instance;
  static EasyChat get instance => _instance ??= EasyChat._();

  // The private constructor for the EasyChat singleton.
  EasyChat._();

  String get uid => FirebaseAuth.instance.currentUser!.uid;
  bool get loggedIn => FirebaseAuth.instance.currentUser != null;

  CollectionReference get chatCol => FirebaseFirestore.instance.collection('easychat');
  CollectionReference messageCol(String roomId) => chatCol.doc(roomId).collection('messages');

  DocumentReference get myDoc => FirebaseFirestore.instance.collection('users').doc(FirebaseAuth.instance.currentUser!.uid);
  DocumentReference roomDoc(String roomId) => chatCol.doc(roomId);

  late final String usersCollection;
  late final String displayNameField;
  late final String photoUrlField;

  final Map<String, UserModel> _userCache = {};

  Function(BuildContext, ChatRoomModel)? onChatRoomFileUpload;

  initialize({
    required String usersCollection,
    required String displayNameField,
    required String photoUrlField,
    Function(BuildContext, ChatRoomModel)? onChatRoomFileUpload,
  }) {
    this.usersCollection = usersCollection;
    this.displayNameField = displayNameField;
    this.photoUrlField = photoUrlField;
    this.onChatRoomFileUpload = onChatRoomFileUpload;
  }

  /// Get user
  ///
  /// It does memory cache.
  Future<UserModel?> getUser(String uid) async {
    if (_userCache.containsKey(uid)) return _userCache[uid];
    final snapshot = await FirebaseFirestore.instance.collection(usersCollection).doc(uid).get();
    if (!snapshot.exists) return null;
    final user = UserModel.fromDocumentSnapshot(snapshot);
    _userCache[uid] = user;
    return _userCache[uid];
  }

  getSingleChatRoomId(String? otherUserUid) {
    if (otherUserUid == null) return null;
    final currentUserUid = FirebaseAuth.instance.currentUser!.uid;
    final uids = [currentUserUid, otherUserUid];
    uids.sort();
    return uids.join('-');
  }

  Future<ChatRoomModel?> getSingleChatRoom(String uid) async {
    final roomId = getSingleChatRoomId(uid);
    final snapshot = await roomDoc(roomId).get();
    if (!snapshot.exists) return null;
    return ChatRoomModel.fromDocumentSnapshot(snapshot);
  }

  Future<ChatRoomModel> getOrCreateSingleChatRoom(String uid) async {
    final room = await EasyChat.instance.getSingleChatRoom(uid);
    if (room != null) return room;
    return await EasyChat.instance.createChatRoom(
      otherUserUid: uid,
    );
  }

  /// Create chat room
  ///
  /// If [otherUserUid] is set, it is a 1:1 chat. If it is unset, it's a group chat.
  Future<ChatRoomModel> createChatRoom({
    String? roomName,
    String? otherUserUid,
    bool isOpen = false,
  }) async {
    // prepare
    String myUid = FirebaseAuth.instance.currentUser!.uid;
    bool isSingleChat = otherUserUid != null;
    bool isGroupChat = !isSingleChat;
    List<String> users = [myUid];
    if (isSingleChat) users.add(otherUserUid);

    // room data
    final roomData = {
      'master': myUid,
      'name': roomName ?? '',
      'createdAt': FieldValue.serverTimestamp(),
      'group': isGroupChat,
      'open': isOpen,
      'users': users,
    };

    // chat room id
    final roomId = isSingleChat ? getSingleChatRoomId(otherUserUid) : chatCol.doc().id;
    await chatCol.doc(roomId).set(roomData);

    // Create users (invite)
    // for (final uid in users) {
    //   final user = await getUser(uid);
    //   await userCol(roomId).doc(uid).set({
    //     'uid': uid,
    //     'displayName': user?.displayName ?? '',
    //     'photoUrl': user?.photoUrl ?? '',
    //   });
    // }

    return ChatRoomModel.fromMap(map: roomData, id: roomId);
  }

  Future<void> inviteUser({required ChatRoomModel room, required UserModel user}) async {
    await roomDoc(room.id).update({
      'users': FieldValue.arrayUnion([user.uid])
    });
  }

  Future<void> joinRoom({required ChatRoomModel room}) async {
    await roomDoc(room.id).update({
      'users': FieldValue.arrayUnion([uid])
    });
  }

  Future<void> sendMessage({
    required ChatRoomModel room,
    String? text,
    String? imageUrl,
    String? fileUrl,
    String? fileName,
  }) async {
    await messageCol(room.id).add({
      if (text != null) 'text': text,
      if (imageUrl != null) 'imageUrl': imageUrl,
      if (fileUrl != null) 'fileUrl': fileUrl,
      if (fileName != null) 'fileName': fileName,
      'createdAt': FieldValue.serverTimestamp(),
      'senderUid': FirebaseAuth.instance.currentUser!.uid,
    });
  }

  /// Get other user uid
  ///
  /// ! It will throw an exception if there is no other user uid. So, use it only in 1:1 chat with minimum of 2 users in array.
  String getOtherUserUid(List<String> users) {
    final currentUserUid = FirebaseAuth.instance.currentUser!.uid;
    return users.firstWhere((uid) => uid != currentUserUid);
  }

  Future<UserModel?> getOtherUserFromSingleChatRoom(ChatRoomModel room) async {
    final otherUserUid = getOtherUserUid(room.users);
    return await getUser(otherUserUid);
  }

  /// Open Chat Room
  ///
  /// When the user taps on a chat room, this method is called to open the chat room.
  /// When the login user taps on a user NOT a chat room, then the user want to chat 1:1. That's why the user tap on the user.
  /// In this case, search if there is a chat room the method checks if the 1:1 chat room exists or not.
  showChatRoom({
    required BuildContext context,
    ChatRoomModel? room,
    UserModel? user,
  }) async {
    assert(room != null || user != null, "One of room or user must be not null");

    // If it is 1:1 chat, get the chat room. (or create if it does not exist)
    if (user != null) {
      room = await EasyChat.instance.getOrCreateSingleChatRoom(user.uid);
    }

    if (context.mounted) {
      showGeneralDialog(
        context: context,
        pageBuilder: (_, __, ___) {
          return Scaffold(
            appBar: ChatRoomAppBar(room: room!),
            body: Column(
              children: [
                Expanded(
                  child: ChatMessagesListView(
                    room: room,
                  ),
                ),
                SafeArea(
                  child: Column(
                    children: [
                      const Divider(height: 0),
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: ChatRoomMessageBox(room: room),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      );
    }
  }

  /// File upload
  ///
  /// This method is invoked when user press button to upload a file.
  onPressedFileUploadIcon({required BuildContext context, required ChatRoomModel room}) async {
    if (onChatRoomFileUpload != null) {
      await onChatRoomFileUpload!(context, room);
      return;
    }
    final re = await showModalBottomSheet<FileSource>(
        context: context,
        builder: (_) => ChatRoomFileUploadBottomSheet(
            room: room)); // For confirmation () removed Image source because we dont have FileSource
    if (re == null) return; // double check

    debugPrint("re: $re");

    if (re == FileSource.gallery || re == FileSource.camera) {
      ImageSource imageSource = re == FileSource.gallery ? ImageSource.gallery : ImageSource.camera;
      onPressedPhotoOption(room: room, imageSource: imageSource);
    } else if (re == FileSource.file) {
      onPressedChooseFileUploadOption(room: room);
    }
  }

  onPressedPhotoOption({required ChatRoomModel room, required ImageSource imageSource}) async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: imageSource);
    if (image == null) {
      return;
    }

    final file = File(image.path);
    final name = sanitizeFilename(image.name, replacement: '-');
    onFileUpload(room: room, file: file, isImage: true, fileStorageName: name);
  }

  onPressedChooseFileUploadOption({required ChatRoomModel room}) async {
    late PlatformFile pickedFile;
    final FilePickerResult? result = await FilePicker.platform.pickFiles();
    if (result == null) return;
    pickedFile = result.files.first;
    final file = File(pickedFile.path!);
    final storageName = sanitizeFilename('${DateTime.now().millisecondsSinceEpoch}-${pickedFile.name}', replacement: '-');
    final fileName = sanitizeFilename(pickedFile.name, replacement: '-');
    onFileUpload(room: room, file: file, isImage: false, fileStorageName: storageName, fileName: fileName);
  }

  onFileUpload({
    required ChatRoomModel room,
    required File file,
    bool isImage = true,
    // TODO ask if we need to have a plugin or a simple way to check what type of file
    String? fileName,
    String? fileStorageName,
  }) async {
    final storageRef = FirebaseStorage.instance.ref();
    final fileRef = storageRef.child("easychat/${EasyChat.instance.uid}/$fileStorageName");
    try {
      await fileRef.putFile(file);
      final url = await fileRef.getDownloadURL();
      isImage
          ? EasyChat.instance.sendMessage(room: room, imageUrl: url)
          : EasyChat.instance.sendMessage(room: room, fileUrl: url, fileName: fileName);
    } on FirebaseException catch (e) {
      // TODO provide a way of displaying error emssage nicley
      print(e);
    }
  }
}
