const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const sumLikes = blogs.reduce((sum, blog) => {
    return sum + blog.likes;
  }, 0);
  return sumLikes;
};

const favoriteBlog = (blogs) => {
  if(blogs.length === 0){
    return {};
  };

  const mostLikes = blogs.reduce((most, blog) => {
    return blog.likes >= most.likes ? blog : most;
  },{likes: 0});

  const formattedFavorite = {
    title: mostLikes.title,
    author: mostLikes.author,
    likes: mostLikes.likes,
  };
  
  return formattedFavorite;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};