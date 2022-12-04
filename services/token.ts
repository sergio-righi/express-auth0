import mongoose from "mongoose"

import { token } from "../utils"
import { TokenModel, UserModel } from "../models"

class TokenService {

  /**
   * it searchs a token that is not expired
   * @param params 
   * @returns 
   */

  async find(params: any) {
    try {
      const response = await TokenModel.findOne({ ...params, expires: { $gte: new Date() } })
      return { status: 200, data: response }
    } catch (err) {
      return { status: 500 }
    }
  }

  /**
   * insert a token checking if there is any other token
   * @param document 
   * @returns 
   */

  async create(document: any) {
    let response = null
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const { code } = document
      // null code means that the token must contain a code otherwise a number (token) is added
      const param = code === null ? { code: token.generateCode() } : { number: token.generateNumber() }

      response = await TokenModel.create({ ...document, ...param })
      await session.commitTransaction()
    } catch (err) {
      await session.abortTransaction()
      return { status: 500 }
    } finally {
      session.endSession()
    }

    return { status: 200, data: response }
  }

  /**
   * updates the situation of the token to done
   * @param id token 
   * @returns 
   */

  async setExpired(id: string) {
    try {
      const response = await TokenModel.findByIdAndUpdate(id, { expires: new Date() }, { new: true })
      return { status: 200, data: response }
    } catch (err) {
      return { status: 500 }
    }
  }

  /**
   * manage the access to the platform when the user is new or when the access is revoked
   * @param userId user id 
   * @param code code 
   * @returns 
   */

  async access(userId: string, state: boolean, code?: string) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const { data }: any = await this.find({ userId, code })
      if (data) {
        await this.setExpired(data?._id) // set the token expired 
        const response = await UserModel.findByIdAndUpdate(userId, { verified: state }, { new: true }).select('-password')
        if (response) {
          await session.commitTransaction()
          return { status: 200, data: response }
        } else {
          await session.abortTransaction()
          return { status: 200, data: null }
        }
      } else {
        await session.abortTransaction()
        return { status: 200, data: null }
      }

    } catch (err) {
      await session.abortTransaction()
      return { status: 500 }
    } finally {
      session.endSession()
    }
  }

  /**
   * set the token used to reset password to done and update the user password
   * @param number token
   * @param password new password
   * @returns 
   */

  async reset(number: string, password: any) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const { data }: any = await this.find({ number })
      if (data) {
        await this.setExpired(data?._id) // set the token expired
        const response = await UserModel.findByIdAndUpdate(data?.userId, password, { new: true }).select('-password')

        if (response) {
          await session.commitTransaction()
          return { status: 200, data: response }
        } else {
          await session.abortTransaction()
          return { status: 200, data: null }
        }
      } else {
        await session.abortTransaction()
        return { status: 200, data: null }
      }

    } catch (err) {
      await session.abortTransaction()
      return { status: 500 }
    } finally {
      session.endSession()
    }
  }
}

export default new TokenService()