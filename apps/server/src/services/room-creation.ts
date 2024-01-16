import { Prisma, PrismaClient } from "@prisma/client";
import {
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
} from "@prisma/client/runtime/library";
const prisma = new PrismaClient();
class ChatRoom {
  private roomName: string;

  constructor(senderId: string, receiverId: string) {
    const sortedIds = [senderId, receiverId].sort();
    this.roomName = sortedIds.join("_");
    console.log(this.roomName);
  }
  public async getOrCreateRoom() {
    let room = await prisma.room.findUnique({
      where: {
        roomId: this.roomName,
      },
    });
    if (!room) {
      try {
        let new_room = await prisma.$transaction([
          prisma.room.create({
            data: {
              roomId: this.roomName,
            },
          }),
        ]);
        return new_room[0];
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          // Unique constraint failed
          room = await prisma.room.findUnique({
            where: {
              roomId: this.roomName,
            },
          });
        }
      }
    }
    return room;
  }
}
export default ChatRoom;
