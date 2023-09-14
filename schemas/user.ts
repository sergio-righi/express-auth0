import { Schema } from 'mongoose'
import { crypto } from 'utils'

export class UserSchema {
  userSchema: Schema

  constructor() {
    this.userSchema = new Schema(
      {
        name: { type: String },
        password: { type: String },
        email: { type: String },
        avatar: { type: String },
        verified: { type: Boolean },
        origin: { type: String },
        originId: { type: String }
      },
      { collection: "auth0_users", timestamps: true }
    );
    this.#setConfiguration();
  }

  #setConfiguration() {

    // this.userSchema.pre("save", function (next: NextFunction) {
    //   this.password = this.password ? this.applyHash(this.password) : this.password;
    //   next();
    // });

    this.userSchema.methods.applyHash = function (password: string) {
      return crypto.hash(password);
    };

    this.userSchema.methods.authenticate = function (password: string) {
      return this.password === this.applyHash(password);
    };

    this.userSchema.set("toJSON", { getters: true });
  }
}

export const UserSchemaInstance = new UserSchema().userSchema;