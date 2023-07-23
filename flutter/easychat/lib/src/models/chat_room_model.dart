import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:easychat/easychat.dart';

class ChatRoomModel {
  final String id;
  final String name;
  final bool group;
  final bool open;
  final String master;
  final List<String> users;

  ChatRoomModel({
    required this.id,
    required this.name,
    required this.group,
    required this.open,
    required this.master,
    required this.users,
  });

  factory ChatRoomModel.fromDocumentSnapshot(DocumentSnapshot documentSnapshot) {
    return ChatRoomModel.fromMap(
        map: documentSnapshot.data() as Map<String, dynamic>, id: documentSnapshot.id);
  }

  factory ChatRoomModel.fromMap({required Map<String, dynamic> map, required id}) {
    return ChatRoomModel(
      id: id,
      name: map['name'] ?? '',
      group: map['group'],
      open: map['open'],
      master: map['master'],
      users: List<String>.from((map['users'] ?? [])),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'group': group,
      'open': open,
      'master': master,
      'users': users,
    };
  }

  @override
  String toString() =>
      'ChatRoomModel(id: $id, name: $name, group: $group, open: $open, master: $master, users: $users)';

  String get otherUserUid {
    assert(users.length == 2 && group == false, "This is not a single chat room");
    return EasyChat.instance.getOtherUserUid(users);
  }
}
