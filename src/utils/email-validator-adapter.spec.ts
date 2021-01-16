import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const email = 'test.user@email.com'

describe('EmailValidator ', () => {
  it('Should return false if validator returns false', async () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid(email)
    expect(isValid).toBe(false)
  })

  it('Should return false if validator returns false', async () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid(email)
    expect(isValid).toBe(true)
  })

  it('Should call validator with correct email', async () => {
    const sut = new EmailValidatorAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid(email)
    expect(isEmailSpy).toBeCalledWith(email)
  })
})
