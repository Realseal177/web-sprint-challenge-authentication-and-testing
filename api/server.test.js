const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

const User = require('./users/users-model')

const brandNewUser = {
  username: 'barney',
  password: 'fife'
}

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})

afterAll(async () => {
  await db.destroy()
})

describe('API endpoint tests', () => {
  describe('auth-router tests', () => {
    describe('/register', () => {
      it('should return a brand new user', async () => {
        const res = await request(server).post('/api/auth/register').send(brandNewUser)
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('username', 'barney')
      })
      it('will have a status code of 201', async () => {
        const res = await request(server).post('/api/auth/register').send(brandNewUser)
        expect(res.status).toBe(201)
      })
    })

    describe('/login', () => {
      it('will login an existing user with correct message', async () => {
        await request(server).post('/api/auth/register').send(brandNewUser)
        const res = await request(server).post('/api/auth/login').send(brandNewUser)
        expect(res.body).toHaveProperty('message', 'welcome, Captain Marvel')
      })
      it('upon login will have a status code 200', async () => {
        await request(server).post('/api/auth/register').send(brandNewUser)
        const res = await request(server).post('/api/auth/login').send(brandNewUser)
        expect(res.status).toBe(200)
      })
    })
  })
  describe('joke-router tests', () => {
    describe('/', () => {
      it('will get all the jokes in the array', async () => {
        await request(server).post('/api/auth/register').send(brandNewUser)
        const login = await request(server).post('/api/auth/login').send(brandNewUser)
        const token = login.body.token
        const res = await request(server).get('/api/jokes').set('Authorization', token)
        expect(res.body).toHaveLength(3)
      })
      it('will return a status code of 200', async () => {
        await request(server).post('/api/auth/register').send(brandNewUser)
        const login = await request(server).post('/api/auth/login').send(brandNewUser)
        const token = login.body.token
        const res = await request(server).get('/api/jokes').set('Authorization', token)
        expect(res.status).toBe(200)
      })
    })
  })
})