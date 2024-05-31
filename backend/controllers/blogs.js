const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog
      .find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
  } catch(exception) {
    next(exception);
  };
});

blogsRouter.post('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if(!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    };
    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes || 0,
      user: user._id,
    });
  
    if(blog.title === undefined || blog.author === undefined){
      return response.status(400).send({ error: 'Bad Request' });
    }
  
    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();
    response.status(201).json(result);
  } catch(exception) {
    next(exception);
  };
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch(exception) {
    next(exception);
  };
});

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const blog = {
      id: request.body.id,
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes,
    };
    const result = await Blog.findByIdAndUpdate(
      request.params.id,
      blog,
      { new: true, context: 'query' },
    );
    if(result === null){
      response.status(404).end();
    }
    response.status(201).end();
  } catch(exception) {
    next(exception);
  };
});

module.exports = blogsRouter;
