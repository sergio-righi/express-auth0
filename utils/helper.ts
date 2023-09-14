import path from 'path'

export function removeExtensionFromFile(filename: string) {
  return path.parse(filename).name;
}

export function fromBearerToken(token: string) {
  return token.replace('Bearer ', '').trim();
}