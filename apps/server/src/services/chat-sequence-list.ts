import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class SequenceList {
  public async getSenders(receiverId: string) {
    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ senderId: receiverId }, { receiverId: receiverId }],
      },
      orderBy: {
        lastMessageTime: "desc",
      },
    });
    return chats;
  }
}
export default SequenceList;
