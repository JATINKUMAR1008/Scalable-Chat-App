interface IOnlineUser {
  userId: string;
  socketId: string;
}
class OnlineUserQueue {
  private onlineUsers: IOnlineUser[] = [];

  public add(user: IOnlineUser) {
    this.onlineUsers.push(user);
  }

  public remove(user: IOnlineUser) {
    this.onlineUsers = this.onlineUsers.filter(
      (u) => u.socketId !== user.socketId
    );
  }

  public getSocketId(userId: string) {
    return this.onlineUsers.find((u) => u.userId === userId)?.socketId;
  }

  get userQueue() {
    return this.onlineUsers;
  }
}
export default OnlineUserQueue;
