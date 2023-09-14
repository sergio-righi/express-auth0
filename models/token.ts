import mongoose from 'mongoose';
import { TokenSchemaInstance } from 'schemas';

export class TokenModel {
  model: any

  constructor() {
    this.model = mongoose.model('Token', TokenSchemaInstance)
  }
}

export const TokenModelInstance = new TokenModel().model