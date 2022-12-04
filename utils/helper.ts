import path from 'path'

export default {
  removeExtensionFromFile: (filename: string) => path.parse(filename).name,
  fromBearerToken: (token: string) => token.replace('Bearer ', '').trim()
}