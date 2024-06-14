const bcrypt = require('bcrypt');
const User = require('../models/user');
const helper = require('./test_helper');
const mongoose = require('mongoose');
const {
  test, after, beforeEach, describe,
} = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await api.post('/api/users').send({ username: 'root', password: 'namtset .rM'});
  })
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'test',
      name: 'Mr. Testman',
      password: 'namtset .rM',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('creation fails when username is already in db', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Mr. Testman',
      password: 'namtset .rM',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
    
    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert(result.body.error.includes('expected `username` to be unique'));
  });
});

describe('creating valid users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('creating user without username fails', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'Mr. Testman',
      password: 'namtseT .rM',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
    
    const usersAtEnd = await helper.usersInDb();
    console.log('usersAtStart', usersAtStart, 'usersAtEnd', usersAtEnd);
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert(result.body.error.includes('expected `username` and `password`'));
  });

  test('creating user without password fails', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'test',
      name: 'Mr. Testman',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
    
    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert(result.body.error.includes('expected `username` and `password`'));
  });

  test('username under 3 characters fails', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'te',
      name: 'Mr. Testman',
      password: 'namtseT .rM',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
    
    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert(result.body.error.includes('username and password must be at least 3 characters'));
  });

  test('password under 3 characcters fails', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'test',
      name: 'Mr. Testman',
      password: 'na',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
    
    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert(result.body.error.includes('username and password must be at least 3 characters'));
  });
});

after(async () => {
  await mongoose.connection.close();
});