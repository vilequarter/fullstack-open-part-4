const _ = require('lodash');

const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  const sumLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0);
  return sumLikes;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const mostLikes = blogs.reduce((most, blog) => {
    return blog.likes >= most.likes ? blog : most;
  }, blogs[0]);

  const formattedFavorite = {
    title: mostLikes.title,
    author: mostLikes.author,
    likes: mostLikes.likes,
  };

  return formattedFavorite;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {};
  const groupByAuthor = _.groupBy(blogs, (blog) => blog.author);
  const most = _.reduce(groupByAuthor, (most, author) => {
    return author.length > most.length ? author : most;
  });
  const formattedMost = {
    author: most[0].author,
    blogs: most.length,
  };
  return formattedMost;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {};
  const groupByAuthor = _.groupBy(blogs, (blog) => blog.author);
  const totalLikes = _.map(groupByAuthor, (author) => {
    const authorLikes = {
      author: author[0].author,
      likes: _.reduce(author, (total, author) => total + author.likes, 0),
    };
    return authorLikes;
  });
  return _.reduce(totalLikes, (most, author) => {
    return author.likes > most.likes ? author : most;
  }, totalLikes[0]);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
