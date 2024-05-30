const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/blog');

usersRouter.post('/', async (request, response, next) => {
  try{
    if(request.body.username === undefined || request.body.password === undefined){
      return response.status(400).send({ error: 'expected `username` and `password`' });
    };
    if(request.body.username.length < 3 || request.body.password.length < 3){
      return response.status(400).send({ error: 'username and password must be at least 3 characters' });
    };
    const { username, name, password } = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
  
    const user = new User({
      username,
      name,
      passwordHash,
    });
  
    const savedUser = await user.save();
  
    response.status(201).json(savedUser);
  } catch(exception) {
    next(exception);
  };
});

usersRouter.get('/', async (request, response, next) => {
  try{
    const users = await User
      .find({}).populate('blogs', { url: 1, title: 1, author: 1});
    response.json(users);
  } catch(exception) {
    next(exception);
  };
})

module.exports = usersRouter;