import { Server, Socket } from "socket.io";
import Redis from "ioredis";
import OnlineUserQueue from "./online-user-queue";
import ChatRoom from "./room-creation";
import ChatService from "./chat-service";
import SequenceList from "./chat-sequence-list";
import ChatGroup from "./group-service";
const publisher = new Redis({
  host: "redis-3b64b34e-jatinkumar10082003-0747.a.aivencloud.com",
  port: 16093,
  username: "default",
  password: "AVNS_VQGTNeaazZt9NaT_jPU",
});
const subscriber = new Redis({
  host: "redis-3b64b34e-jatinkumar10082003-0747.a.aivencloud.com",
  port: 16093,
  username: "default",
  password: "AVNS_VQGTNeaazZt9NaT_jPU",
});

const onlineUserQueue = new OnlineUserQueue();
const sequenceList = new SequenceList();
const groupChat = new ChatGroup();

class SocketService {
  private _io: Server;
  constructor() {
    console.log("init socket server");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: ["http://localhost:3000"],
      },
    });
  }

  public async messageEmiiter(payload: any, socket: Socket) {
    socket.emit("message", payload);
  }

  public initListeners() {
    console.log("init socket listeners");

    subscriber.on("message", async (channel, message) => {
      console.log("Received message %s from channel %s", message, channel);
      const payload = JSON.parse(message);
      const chatservice = new ChatService(payload.senderId, payload.receiverId);
      await chatservice.addMessage(payload);
      console.log("message added to database");
      const senderSocketId =
        onlineUserQueue.getSocketId(payload.senderId) || "";
      const receiverSocketId =
        onlineUserQueue.getSocketId(payload.receiverId) || ""; // Fix: Provide a default value of an empty string if sockerId is undefined
      this._io.to(senderSocketId).emit("message", message);
      console.log("message sent to sender");
      this._io.to(receiverSocketId).emit("message", message);
      console.log("message sent to receiver");
      const d_c_list2 = await sequenceList.getSenders(payload.senderId);
      this._io.to(senderSocketId).emit("event:sequenceList", d_c_list2);
      const d_c_list = await sequenceList.getSenders(payload.receiverId);
      this._io.to(receiverSocketId).emit("event:sequenceList", d_c_list);
    });

    this._io.on("connect", async (socket) => {
      if (!socket.handshake.query.userId) return;
      console.log("user Id:" + socket.handshake.query.userId);
      console.log("connection id: " + socket.id);
      onlineUserQueue.add({
        userId:
          typeof socket.handshake.query.userId === "string"
            ? socket.handshake.query.userId
            : socket.handshake.query.userId?.[0] ?? "",
        socketId: socket.id,
      });

      const d_c_list = await sequenceList.getSenders(
        typeof socket.handshake.query.userId === "string"
          ? socket.handshake.query.userId
          : socket.handshake.query.userId?.[0] ?? ""
      );
      socket.emit("event:sequenceList", d_c_list);

      const groupList = await groupChat.getGroups(
        typeof socket.handshake.query.userId === "string"
          ? socket.handshake.query.userId
          : socket.handshake.query.userId?.[0] ?? ""
      );

      socket.emit("event:groupList", groupList);
      socket.on("event:createGroup", async (payload) => {
        const { groupName, userIds } = payload;
        const group = await groupChat.createGroup(groupName, userIds);
        const groupList = await groupChat.getGroups(
          typeof socket.handshake.query.userId === "string"
            ? socket.handshake.query.userId
            : socket.handshake.query.userId?.[0] ?? ""
        );
        socket.emit("event:groupList", groupList);
      });
      socket.on("event:getChatMessages", async (payload) => {
        console.log("sending messages");
        const { receiverId } = payload;
        const chatservice = new ChatService(
          typeof socket.handshake.query.userId === "string"
            ? socket.handshake.query.userId
            : socket.handshake.query.userId?.[0] ?? "",
          receiverId
        );
        const messages = await chatservice.getMessages(
          typeof socket.handshake.query.userId === "string"
            ? socket.handshake.query.userId
            : socket.handshake.query.userId?.[0] ?? "",
          receiverId
        );
        socket.emit("messages", messages);
      });

      socket.on("event:connectToRoom", async (payload) => {
        const { receiverId } = payload;

        const room = new ChatRoom(
          typeof socket.handshake.query.userId === "string"
            ? socket.handshake.query.userId
            : socket.handshake.query.userId?.[0] ?? "",
          receiverId
        ); // Fix: Ensure userId and senderId are of type string
        const roomName = await room.getOrCreateRoom();

        if (roomName) {
          await subscriber.subscribe(roomName.roomId);
        }
        socket.emit("event:joinedSuccessfully", { status: true });
        console.log("connected");

        console.log("channel", roomName?.roomId); // Fix: Add null check before accessing roomId
      });

      const activeList = onlineUserQueue.userQueue;
      console.log(activeList);
      activeList.map((item) => {
        socket.emit("onlineQueue", activeList);
        socket.to(item.socketId).emit("onlineQueue", activeList);
      });

      socket.on("event:message", async (payload) => {
        console.log("message received is: " + payload.message);
        const { senderId, receiverId } = payload;
        const room = new ChatRoom(receiverId, senderId); // Fix: Ensure userId and senderId are of type string
        const roomName = await room.getOrCreateRoom();
        console.log(roomName?.roomId); // Fix: Add null check before accessing roomId
        await publisher.publish(
          roomName?.roomId || "",
          JSON.stringify(payload)
        ); // Fix: Add null check before accessing roomId and provide a default value of an empty string
      });

      socket.on("disconnect", () => {
        console.log("user disconnected");
        onlineUserQueue.remove({
          userId:
            typeof socket.handshake.query.userId === "string"
              ? socket.handshake.query.userId
              : socket.handshake.query.userId?.[0] ?? "",
          socketId: socket.id,
        });
        const activeList = onlineUserQueue.userQueue;
        console.log(activeList);
        activeList.map((item) => {
          socket.emit("onlineQueue", activeList);
          socket.to(item.socketId).emit("onlineQueue", activeList);
        });
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
