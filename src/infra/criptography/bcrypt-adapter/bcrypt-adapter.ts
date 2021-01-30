import bcrypt from 'bcrypt'
import { IHasher } from '../../../data/protocols/criptography/hasher'
import { IHashComparer } from '../../../data/protocols/criptography/hash-comparer'

export class BcryptAdapter implements IHasher, IHashComparer {
  constructor (private readonly salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt)
    return hashedValue
  }

  async compare (value: string, hashedValue: string): Promise<boolean> {
    return await bcrypt.compare(value, hashedValue)
  }
}
