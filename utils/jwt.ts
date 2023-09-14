import { decode, sign, verify } from 'jsonwebtoken';

import { JWTType } from 'interfaces';
import { crypto, enums, env } from 'utils';

function generateToken(userId: string, type: enums.TokenType) {
  const secret = String(env.AUTH_SECRET);
  const expiresIn =
    type === enums.TokenType.ACCESS_TOKEN
      ? String(env.JWT_EXPIRES_IN)
      : String(env.REFRESH_JWT_EXPIRES_IN);

  const token = sign({ type }, secret, {
    expiresIn,
    subject: userId,
  });

  return {
    token: crypto.encrypt(token),
    expiration: (decode(token) as JWTType).exp * 1000,
  };
};

export function generateAccessToken(userId: string) {
  return generateToken(userId, enums.TokenType.ACCESS_TOKEN);
}

export function generateRefreshToken(userId: string) {
  return generateToken(userId, enums.TokenType.REFRESH_TOKEN);
}

export function getTokenType(token: string): enums.TokenType {
  return (verify(token, String(env.AUTH_SECRET)) as JWTType).type;
}

export function parseTokenAndGetUserId(token: string): string {
  const decryptedToken = crypto.decrypt(token);
  const decoded = verify(decryptedToken, String(env.AUTH_SECRET)) as JWTType;
  return decoded.sub || '';
}