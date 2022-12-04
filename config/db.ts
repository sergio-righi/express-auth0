import mongoose from 'mongoose';

import { env } from '../utils'

class Db {
  #connectionString = env.get('mongoose');

  async connect() {
    await mongoose.connect(this.#connectionString)
    const databaseConnection = mongoose.connection
    databaseConnection.on(
      'error',
      console.error.bind(console, 'MongoDB Connection error')
    )
  }
}

export default new Db();