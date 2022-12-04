import { enums } from '../utils'

export default interface JWTType {
  exp: number;
  type: enums.TokenType;
  sub: string;
}