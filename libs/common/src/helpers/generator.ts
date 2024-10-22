import * as crypto from 'crypto';
import { customAlphabet, nanoid } from 'nanoid';

type RandomType = 'text' | 'numeric' | 'textAndNumber';

type RandomMethodReturnType<T extends RandomType> = T extends 'numeric'
  ? number
  : string;

class Generator {
  /**
   * Generate a hashed token
   * @param charLength - The length of the token
   * @returns The generated hashed token
   * @example
   * generateHashedToken(10)
   * returns 'a1b2c3d4e5'
   */
  static hashedToken(charLength: number): string {
    const token = crypto.randomBytes(charLength).toString('hex'); // unencrypted token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex'); // encrypted token
    return hashedToken;
  }

  /**
   * Generate a random id
   * @param length - The length of the id
   * @param type - The type of the id
   * @param prefix - The prefix of the id
   * @returns The generated id
   *
   * @examplez
   * ```typescript
   * Generator.random(10, 'numeric')
   * returns 1234567890
   * ```
   */
  static random<T extends RandomType>(
    length: number,
    type: T,
  ): RandomMethodReturnType<T> {
    if (type === 'numeric') {
      const randomNumber = customAlphabet('0123456789', length);
      return parseInt(randomNumber()) as RandomMethodReturnType<T>;
    }

    if (type === 'text') {
      const randomText = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', length);
      return randomText() as RandomMethodReturnType<T>;
    }

    if (type === 'textAndNumber') {
      const randomID = nanoid(length);
      return randomID as RandomMethodReturnType<T>;
    }

    throw new Error('Invalid type provided');
  }
}

export default Generator;
