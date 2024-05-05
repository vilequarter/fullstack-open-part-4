const {
  test, after, beforeEach, describe,
} = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
];

describe.only('api test', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    let blogObject = new Blog(initialBlogs[0]);
    await blogObject.save();
    blogObject = new Blog(initialBlogs[1]);
    await blogObject.save();
  });

  test('notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test('first blog includes react patterns', async () => {
    const response = await api.get('/api/blogs');
    const contents = JSON.stringify(response.body[0]);

    assert(contents.includes('React patterns'));
  });

  test('blog unique identifier is named id', async () => {
    const response = await api.get('/api/blogs');
    const contents = JSON.stringify(response.body[0]);

    assert(contents.includes('id'));
    assert.strictEqual(contents.includes('_id'), false);
  });

  test.only('making a POST request adds a blog to the database', async () => {
    const newBlog = {
      title: 'This is only a test',
      author: 'Mr. Testman',
      url: 'www.testtest.test',
      likes: 42,
   };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    
    const response = await api.get('/api/blogs');
    const contents = JSON.stringify(response.body[2]);

    assert.strictEqual(response.body.length, initialBlogs.length + 1);
    assert(contents.includes('This is only a test'));
  });
});

after(async () => {
  await mongoose.connection.close();
});
