const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response, next) => {
  try{
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
    const users = await User.find({});
    response.json(users);
  } catch(exception) {
    next(exception);
  };
})

module.exports = usersRouter;