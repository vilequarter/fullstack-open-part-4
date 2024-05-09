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

describe.only('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('drowssap', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test.only('creation succeeds with a fresh username', async () => {
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

  test.only('creation fails when username is already in db', async () => {
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

after(async () => {
  await mongoose.connection.close();
});