const Blog = require('../models/blog');
const User = require('../models/user');
const supertest = require('supertest');
const app = require('../app');

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

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willberemoved' });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

const authorizedApi = async () => {
  let api = supertest(app);
  await User.deleteMany({});

  await api.post('/api/users').send({ username: 'Test', password: 'namtseT .rM' });

  const response = await api.post('/api/login').send({ username: 'Test', password: 'namtseT .rM' });
  const token = response.body.token;

  api = supertest.agent(app).set('Authorization', `Bearer ${token}`);
  return api;
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb, authorizedApi,
};
