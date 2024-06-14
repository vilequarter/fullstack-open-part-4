const jwt = require('jsonwebtoken');
const brcypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response, next) => {
  try{
    const { username, password } = request.body;

    const user = await User.findOne({ username });
    const passwordCorrect = user === null
      ? false
      : await brcypt.compare(password, user.passwordHash);

      if(!(user && passwordCorrect)){
        console.log("invalid username or password");
        return response.status(401).json({ error: 'invalid username or password' });
      };

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      const token = jwt.sign(userForToken, process.env.SECRET);
      
      response
        .status(200)
        .send({ token, username: user.username, name: user.name });
  } catch(exception) {
    next(exception);
  };
})

module.exports = loginRouter;