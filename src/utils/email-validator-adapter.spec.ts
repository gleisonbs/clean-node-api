import { EmailValidatorAdapter } from './email-validator-adapter'

const email = 'test.user@email.com'

describe('EmailValidator ', () => {
  it('Should return false if validator returns false', async () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid(email)
    expect(isValid).toBe(false)
  })
})
