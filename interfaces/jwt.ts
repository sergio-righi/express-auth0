import { enums } from '../utils'

export interface JWTType {
  exp: number;
  type: enums.TokenType;
  sub: string;
}