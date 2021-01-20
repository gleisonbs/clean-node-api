import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  it('Should return an account on success', async () => {
    await request(app).post('/api/signup')
      .send({
        name: 'Test User',
        email: 'test.user@email.com',
        password: 'test.password',
        passwordConfirmation: 'test.password'
      })
      .expect(200)
  })
})
