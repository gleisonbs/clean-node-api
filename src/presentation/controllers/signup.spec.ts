import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'

describe('SignUp Controller', () => {
  let email
  let password
  let name
  beforeEach(() => {
    name = 'Test User'
    email = 'test.user@email.com'
    password = 'test.password'
  })

  it('Should return 400 if name is not provided', async () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email,
        password,
        passwordConfirmation: password
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if email is not provided', async () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name,
        password,
        passwordConfirmation: password
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if password is not provided', async () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name,
        email,
        passwordConfirmation: password
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
})
