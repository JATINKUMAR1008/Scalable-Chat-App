import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
class ChatGroup {
  public async createGroup(groupName: string, userIds: string[]) {
    const group = await prisma.groupRoom.create({
      data: {
        name: groupName,
        users: {
          connect: userIds.map((id) => ({ id })),
        },
      },
    });
  }
  public async addUserToGroup(groupId: string, userId: string) {
    const group = await prisma.groupRoom.update({
      where: {
        id: groupId,
      },
      data: {
        users: {
          connect: [{ id: userId }],
        },
      },
    });
  }
  public async getGroup(groupId: string) {
    const group = await prisma.groupRoom.findUnique({
      where: {
        id: groupId,
      },
      include: {
        users: true,
      },
    });
    return group;
  }
  public async getGroups(userId: string) {
    const groups = await prisma.groupRoom.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
      },
    });
    return groups;
  }
  public async removeUserFromGroup(groupId: string, userId: string) {
    const group = await prisma.groupRoom.update({
      where: {
        id: groupId,
      },
      data: {
        users: {
          disconnect: [{ id: userId }],
        },
      },
    });
  }
}
export default ChatGroup;
