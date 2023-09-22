import mongoose from 'mongoose';

import { env } from 'utils'

export class Db {
  #connectionString = String(env.get('mongoose'));

  async connect() {
    await mongoose.connect(this.#connectionString)
    const databaseConnection = mongoose.connection
    databaseConnection.on(
      'error',
      console.error.bind(console, 'MongoDB Connection error')
    )
  }
}

export const DbInstance = new Db();