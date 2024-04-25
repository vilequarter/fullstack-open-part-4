const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const {info, error} = require('./utils/logger');
const config = require('./utils/config');
const Blog = require('./models/blog');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');

mongoose.set('strictQuery', false);

const app = express();

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    info(`Connected to mongodb`);
  })
  .catch((error) => {
    error(`error connecting to mongodb: ${error.message}`);
  });


app.use(express.json());
app.use(express.static('./backend/dist'));
app.use(cors());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
