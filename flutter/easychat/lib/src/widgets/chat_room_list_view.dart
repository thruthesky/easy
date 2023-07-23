import 'dart:developer';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:easychat/easychat.dart';
import 'package:firebase_ui_firestore/firebase_ui_firestore.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

class ChatRoomListViewController {
  late final ChatRoomListViewState state;

  ///
  showChatRoom({required BuildContext context, UserModel? user, ChatRoomModel? room}) {
    EasyChat.instance.showChatRoom(context: context, user: user, room: room);
  }
}

/// ChatRoomListView
///
/// It uses [FirestoreListView] to show the list of chat rooms which uses [ListView] internally.
/// And it supports some(not all) of the ListView properties.
///
/// Note that, the controller of ListView is named [scrollController] in this class.
class ChatRoomListView extends StatefulWidget {
  const ChatRoomListView({
    super.key,
    required this.controller,
    this.itemBuilder,
    this.pageSize = 10,
    this.scrollController,
    this.primary,
    this.physics,
    this.shrinkWrap = false,
    this.padding,
    this.dragStartBehavior = DragStartBehavior.start,
    this.keyboardDismissBehavior = ScrollViewKeyboardDismissBehavior.manual,
    this.clipBehavior = Clip.hardEdge,
  });

  final ChatRoomListViewController controller;
  final int pageSize;
  final Widget Function(BuildContext, ChatRoomModel)? itemBuilder;
  final ScrollController? scrollController;
  final bool? primary;
  final ScrollPhysics? physics;
  final bool shrinkWrap;
  final EdgeInsetsGeometry? padding;

  final DragStartBehavior dragStartBehavior;
  final ScrollViewKeyboardDismissBehavior keyboardDismissBehavior;
  final Clip clipBehavior;

  // final void Function(ChatRoomModel) onTap;

  @override
  State<ChatRoomListView> createState() => ChatRoomListViewState();
}

class ChatRoomListViewState extends State<ChatRoomListView> {
  @override
  void initState() {
    super.initState();
    widget.controller.state = this;
  }

  @override
  Widget build(BuildContext context) {
    if (EasyChat.instance.loggedIn == false) {
      return const Center(child: Text('Error - Please, login first to use Easychat'));
    }
    return FirestoreListView(
      query: EasyChat.instance.chatCol.where('users', arrayContains: EasyChat.instance.uid),
      itemBuilder: (context, QueryDocumentSnapshot snapshot) {
        final room = ChatRoomModel.fromDocumentSnapshot(snapshot);
        if (widget.itemBuilder != null) {
          return widget.itemBuilder!(context, room);
        } else {
          return ChatRoomListTile(room: room);
        }
      },
      errorBuilder: (context, error, stackTrace) {
        log(error.toString(), stackTrace: stackTrace);
        return const Center(child: Text('Error loading chat rooms'));
      },
      pageSize: widget.pageSize,
      controller: widget.scrollController,
      primary: widget.primary,
      physics: widget.physics,
      shrinkWrap: widget.shrinkWrap,
      padding: widget.padding,
      dragStartBehavior: widget.dragStartBehavior,
      keyboardDismissBehavior: widget.keyboardDismissBehavior,
      clipBehavior: widget.clipBehavior,
    );
  }
}

class ChatRoomAppBar extends StatefulWidget implements PreferredSizeWidget {
  const ChatRoomAppBar({
    super.key,
    required this.room,
  });

  final ChatRoomModel room;

  @override
  createState() => ChatRoomAppBarState();

  @override
  final Size preferredSize = const Size.fromHeight(kToolbarHeight);
}

class ChatRoomAppBarState extends State<ChatRoomAppBar> {
  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      title: ChatRoomAppBarTitle(room: widget.room),
      actions: [
        ChatRoomMenuButton(
          room: widget.room,
        ),
      ],
    );
  }
}

class ChatRoomMenuButton extends StatelessWidget {
  const ChatRoomMenuButton({
    super.key,
    required this.room,
  });

  final ChatRoomModel room;
  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.menu),
      onPressed: () async {
        final otherUser = room.group == true ? null : await EasyChat.instance.getOtherUserFromSingleChatRoom(room);
        if (context.mounted) {
          showGeneralDialog(
            context: context,
            pageBuilder: (context, _, __) {
              return Scaffold(
                appBar: AppBar(
                  title: const Text('Chat Room'),
                ),
                body: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: ListView(
                    children: [
                      if (room.group) ...[Text(room.name)],
                      if (!room.group) ...[Text(otherUser!.displayName)],
                      InviteUserButton(room: room),
                      ChatMembersButton(room: room),
                    ],
                  ),
                ),
              );
            },
          );
        }
      },
    );
  }
}

class ChatMembersButton extends StatelessWidget {
  const ChatMembersButton({
    super.key,
    required this.room,
  });

  final ChatRoomModel room;

  @override
  Widget build(BuildContext context) {
    return TextButton(
      child: const Text("Members"),
      onPressed: () {
        showGeneralDialog(
          context: context,
          pageBuilder: (context, _, __) {
            return Scaffold(
              appBar: AppBar(
                title: const Text('Chat Members'),
              ),
              body: ListView.builder(
                itemCount: room.users.length,
                itemBuilder: (context, index) {
                  return FutureBuilder(
                    future: EasyChat.instance.getUser(room.users[index]),
                    builder: (context, userSnapshot) {
                      return ListTile(
                        title: Text(userSnapshot.data?.displayName ?? ''),
                        subtitle: Text(userSnapshot.data?.uid ?? ''),
                        leading: (userSnapshot.data?.photoUrl ?? '').isEmpty
                            ? null
                            : CircleAvatar(
                                backgroundImage: NetworkImage(userSnapshot.data!.photoUrl),
                              ),
                        onTap: () {
                          showDialog(
                            context: context,
                            builder: (context) {
                              return AlertDialog(
                                title: Text(userSnapshot.data?.displayName ?? userSnapshot.data?.uid ?? ''),
                                // TODO check first if Moderator
                                content: TextButton(
                                  child: const Text('Kick Out'),
                                  onPressed: () {
                                    debugPrint('Kicking this person out ${userSnapshot.data?.displayName}');
                                  },
                                ),
                              );
                            },
                          );
                        },
                      );
                    },
                  );
                },
              ),
            );
          },
        );
      },
    );
  }
}

class InviteUserButton extends StatelessWidget {
  const InviteUserButton({
    super.key,
    required this.room,
  });

  final ChatRoomModel room;

  @override
  Widget build(BuildContext context) {
    return TextButton(
      child: const Text('Invite User'),
      onPressed: () {
        showGeneralDialog(
          context: context,
          pageBuilder: (context, _, __) {
            return Scaffold(
              appBar: AppBar(
                title: const Text('Invite Users'),
              ),
              body: InviteUserListView(room: room),
            );
          },
        );
      },
    );
  }
}

class InviteUserListView extends StatefulWidget {
  const InviteUserListView({
    super.key,
    required this.room,
  });

  final ChatRoomModel room;

  @override
  State<InviteUserListView> createState() => _InviteUserListViewState();
}

class _InviteUserListViewState extends State<InviteUserListView> {
  @override
  Widget build(BuildContext context) {
    final query = FirebaseFirestore.instance
        .collection(EasyChat.instance.usersCollection)
        .where(FieldPath.documentId, whereNotIn: widget.room.users.take(10)); // Error message says limit is 10
    return FirestoreListView(
      query: query,
      itemBuilder: (context, snapshot) {
        // TODO how to remove blinking
        final user = UserModel.fromDocumentSnapshot(snapshot);
        if (widget.room.users.contains(user.uid)) {
          return const SizedBox();
        } else {
          return ListTile(
            title: Text(user.displayName),
            subtitle: Text(user.uid),
            leading: user.photoUrl.isEmpty
                ? null
                : CircleAvatar(
                    backgroundImage: NetworkImage(user.photoUrl),
                  ),
            onTap: () {
              debugPrint("Adding user ${user.displayName}");
              EasyChat.instance.inviteUser(room: widget.room, user: user).then((value) {
                setState(() {
                  widget.room.users.add(user.uid);
                });
              });
            },
          );
        }
      },
    );
  }
}

class ChatRoomAppBarTitle extends StatelessWidget {
  const ChatRoomAppBarTitle({
    super.key,
    required this.room,
  });

  final ChatRoomModel room;
  @override
  Widget build(BuildContext context) {
    if (room.group) {
      return Row(
        children: [
          const SizedBox(width: 8),
          Text(room.name),
        ],
      );
    } else {
      return FutureBuilder(
        future: EasyChat.instance.getUser(room.otherUserUid),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Text('Loading...');
          }
          if (snapshot.hasData == false) {
            return const Text('Error - no user');
          }
          final user = snapshot.data as UserModel;
          return Row(
            children: [
              user.photoUrl.isEmpty
                  ? const SizedBox()
                  : CircleAvatar(
                      backgroundImage: NetworkImage(user.photoUrl),
                    ),
              const SizedBox(width: 8),
              Text(user.displayName),
            ],
          );
        },
      );
    }
  }
}
