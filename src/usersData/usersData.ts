import { DataType, UserType } from "../types";

export class UsersData {
  data: DataType;
  protected setData(data: DataType) {
    this.data = data;
  }

  constructor(initialValue = {}) {
    this.data = initialValue;
    this.setData.bind(this);
  }
  getData() {
    return this.data;
  }

  updateData(data: DataType) {
    return this.setData(data);
  }

  getUsers() {
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
