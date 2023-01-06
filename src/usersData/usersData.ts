import { UserType } from "../types";

const _initialValue = {};

export class UsersData {
  data: Record<string, UserType>;
  protected setData(data: Record<string, UserType>) {
    this.data = data;
  }

  constructor(initialValue = _initialValue || {}) {
    this.data = initialValue;
    this.setData.bind(this);
  }
  getData() {
    return Object.values(this.data);
  }

  getUser(userId: string) {
    return this.data[userId];
  }

  addUser(user: UserType) {
    this.setData({ ...this.data, [user.id]: user });
  }

  updateUser(user: UserType) {
    this.setData({ ...this.data, [user.id]: user });
  }

  deleteUser(userId: string) {
    const { [userId]: omit, ...rest } = this.data;
    this.setData(rest);
  }
}
