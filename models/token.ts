import mongoose from 'mongoose';
import { TokenSchema } from '../schemas';

class TokenModel {
  model: any

  constructor() {
    this.model = mongoose.model('Token', TokenSchema)
  }
}

export default new TokenModel().model