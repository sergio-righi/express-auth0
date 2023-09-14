import mongoose from 'mongoose';
import { UserSchemaInstance } from 'schemas';

export class UserModel {
  model: any

  constructor() {
    this.model = mongoose.model('User', UserSchemaInstance)
  }
}

export const UserModelInstance = new UserModel().model