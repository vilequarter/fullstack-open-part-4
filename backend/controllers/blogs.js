const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
  });

  console.log(blog.title);

  if(blog.title === undefined || blog.author === undefined){
    return response.status(400).send({ error: 'Bad Request' });
  }

  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = blogsRouter;
