
const {
  test, after, beforeEach, describe,
} = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');

let api;

describe('general api test', () => {
  beforeEach(async () => {
    api = await helper.authorizedApi();
    await Blog.deleteMany({});
  
    const blogObjects = helper.initialBlogs
      .map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
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
});

describe('POST requests', () => {
  beforeEach(async () => {
    api = await helper.authorizedApi();
    await Blog.deleteMany({});
  
    const blogObjects = helper.initialBlogs
      .map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  test('making a POST request adds a blog to the database', async () => {
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
    
    const blogsAtEnd = await helper.blogsInDb();
    const contents = JSON.stringify(blogsAtEnd[2]);

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
    assert(contents.includes('This is only a test'));
  });

  test('making a new blog without a likes field defaults the value to 0', async () => {
    const newBlog = {
      title: 'Nobody likes me',
      author: 'Mr. Sadman',
      url: 'www.goeatworms.net',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    
    const blogsAtEnd = await helper.blogsInDb();
    const likes = blogsAtEnd[2].likes;

    assert.strictEqual(likes, 0);
  });

  test('missing title in new blog request returns 400 error', async () => {
    const newBlog = {
      author: 'Ms. Mystery',
      url: 'www.nobodyknows.org',
      likes: 999,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
    
    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  test('missing author in new blog request returns 400 error', async () => {
    const newBlog = {
      title: 'Super clean initiation',
      url: 'www.nobody.ghost',
      likes: 404,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
    
    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  test('no token provided returns 401 error', async () => {
    api = supertest(app);
    const newBlog = {
      author: 'Ms. Mystery',
      url: 'www.nobodyknows.org',
      likes: 999,
    };
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(401);
  })
});

describe('DELETE requests', () => {
  beforeEach(async () => {
    api = await helper.authorizedApi();
    await Blog.deleteMany({});
  
    const promiseArray = helper.initialBlogs.map((blog) => api.post('/api/blogs').send(blog));
    await Promise.all(promiseArray);
  });

  test('making a DELETE request on an id removes the blog', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);
    
    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

    const deletedTitle = JSON.stringify(blogToDelete.title);
    assert(!JSON.stringify(blogsAtEnd).includes(deletedTitle));
  });

  test('making a DELETE request on an invalid id returns a 400 error', async () => {
    await api
      .delete('/api/blogs/1234')
      .expect(400);
    
    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  test('making a DELETE request on a nonexistent id returns a 204 error', async () => {
    const nonExistingId = await helper.nonExistingId();
    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .expect(204);
    
    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });
});

describe('UPDATE requests', () => {
  beforeEach(async () => {
    api = await helper.authorizedApi();
    await Blog.deleteMany({});
  
    const blogObjects = helper.initialBlogs
      .map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  test('making an UPDATE request on an id changes the info', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    };
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(201);
    
    const blogsAtEnd = await helper.blogsInDb();
    const updatedInDb = blogsAtEnd[0];
    assert.strictEqual(blogToUpdate.likes + 1, updatedInDb.likes);
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
  });

  test('making an UPDATE request on an invalid id returns a 404 error', async () => {
    const nonexistentBlogId = await helper.nonExistingId();
    const blogsAtStart = await helper.blogsInDb();

    await api
      .put(`/api/blogs/${nonexistentBlogId}`)
      .send({ likes: 0 })
      .expect(404);
    
    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
