import mongoose from 'mongoose';
import { UserSchema } from '../schemas';

class UserModel {
  model: any

  constructor() {
    this.model = mongoose.model('User', UserSchema)
  }
}

export default new UserModel().model