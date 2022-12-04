import { Schema } from 'mongoose'

class TokenSchema {
  tokenSchema: Schema

  constructor() {
    this.tokenSchema = new Schema(
      {
        userId: { type: String, required: true },
        number: { type: String },
        code: { type: String },
        expires: { type: Date, default: new Date().setDate(new Date().getDate() + 1) }
      },
      { collection: "auth0_tokens", timestamps: true }
    );
    this.#setConfiguration();
  }

  #setConfiguration() {

    this.tokenSchema.set("toJSON", { getters: true });
  }
}

export default new TokenSchema().tokenSchema;