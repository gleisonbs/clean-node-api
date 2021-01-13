import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  let email
  let password
  beforeEach(() => {
    email = 'test.user@email.com'
    password = 'test.password'
  })

  it('Should return 400 if no name is provided', async () => {
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
  })
})
