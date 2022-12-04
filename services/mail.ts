import { AuthService, TokenService } from "../services"
import { file, mail } from "../utils"

class MailService {

  /**
   * create and send a verification code email
   * @param options from, to, subject and content
   * @returns 
   */

  async verificationCode(options: any) {
    const { mail: { to: email } } = options
    const { data } = await AuthService.find({ email }) // get user
    if (data) {
      let response = await TokenService.find({ userId: data?._id, code: { $exists: true } }) // find active token
      if (!response.data) {
        response = await TokenService.create({ userId: data?._id, code: null }) // create a token with code
      }
      if (response.data) {
        options.content.code = response.data.code // append code to parse
        const html = file.readAndReplace('verification_code.html', options.content)
        return await this.send({
          ...options.mail,
          html
        })
      } else {
        return { status: response.status }
      }
    } else {
      return { status: 500 }
    }
  }

  /**
   * create and send a reset password email
   * @param options  from, to, subject and content
   * @returns 
   */

  async forgetPassword(options: any) {
    const { mail: { to: email } } = options
    const { data } = await AuthService.find({ email }) // get user
    if (data) {
      let response = await TokenService.find({ userId: data?._id, number: { $exists: true } }) // find active token
      if (!response.data) {
        response = await TokenService.create({ userId: data?._id, number: null }) // create a token with number
      }
      if (response.data) {
        options.content.href += `&token=${response.data.number}` // append the token to parse
        const html = file.readAndReplace('forget_password.html', options.content)
        return await this.send({
          ...options.mail,
          html
        })
      } else {
        return { status: response.status }
      }
    } else {
      return { status: 500 }
    }
  }

  /**
   * send and email using the transporter
   * @param options the content of the email
   * @returns 
   */

  async send(options: any) {
    try {
      const transporter = await mail.createTransporter()
      await transporter.sendMail(options)
      transporter.close()
      return { status: 200 }
    } catch (err) {
      return { status: 500 }
    }
  }
}

export default new MailService()