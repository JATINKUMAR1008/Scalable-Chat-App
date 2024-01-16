import { Prisma, PrismaClient } from "@prisma/client";
import { Mutex } from "async-mutex";
const prisma = new PrismaClient();
const mutex = new Mutex();
class ChatService {
  private chatId: number;
  constructor(senderId: string, receiverId: string) {
    this.chatId = 0; // Assign an initial vthis.initialize(senderId, receiverId);
  }
  public async getOrCreateChatId(senderId: string, receiverId: string) {
    return mutex.runExclusive(async () => {
      let chat = await prisma.chat.findFirst({
        where: {
          OR: [
            { AND: [{ senderId: senderId }, { receiverId: receiverId }] },
            { AND: [{ senderId: receiverId }, { receiverId: senderId }] },
          ],
        },
      });

      if (!chat) {
        try {
          let new_chat = await prisma.$transaction([
            prisma.chat.create({
              data: {
                senderId: senderId,
                receiverId: receiverId,
              },
            }),
          ]);
          return new_chat[0].id;
        } catch (err: unknown) {
          if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === "P2002"
          ) {
            // Unique constraint failed
            chat = await prisma.chat.findFirst({
              where: {
                OR: [
                  { AND: [{ senderId: senderId }, { receiverId: receiverId }] },
                  { AND: [{ senderId: receiverId }, { receiverId: senderId }] },
                ],
              },
            });
          } else {
            throw err;
          }
        }
      }

      if (chat) {
        return chat.id;
      }
    });
  }
  private async initialize(senderId: string, receiverId: string) {
    const id = await this.getOrCreateChatId(senderId, receiverId);
    if (id) {
      this.chatId = id;
    }
  }

  public async addMessage(payload: any) {
    await this.initialize(payload.senderId, payload.receiverId);
    const message = await prisma.message.create({
      data: {
        content: payload.message,
        senderId: payload.senderId,
        receiverId: payload.receiverId,
        chatId: this.chatId,
      },
    });
    await prisma.chat.update({
      where: {
        id: this.chatId,
      },
      data: {
        lastMessageTime: new Date(),
        lastMessage: payload.message,
      },
    });
  }

  public async getMessages(senderId: string, receiverId: string) {
    await this.initialize(senderId, receiverId);
    const messages = await prisma.message.findMany({
      where: {
        chatId: this.chatId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return messages;
  }
}
export default ChatService;
