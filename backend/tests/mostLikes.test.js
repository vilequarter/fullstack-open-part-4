const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const blogs = require('./blogLists');

describe(('most likes'), () => {
  test('most likes on filled list returns author with most likes', () => {
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    };
    const result = listHelper.mostLikes(blogs.multipleBlogs);
    assert.deepStrictEqual(result, expected);
  });
  test('most likes on list with one blog returns that author', () => {
    const expected = {
      author: 'Robert C. Martin',
      likes: 10,
    };
    const result = listHelper.mostLikes(blogs.oneBlog);
    assert.deepStrictEqual(result, expected);
  });
  test('most likes on empty list returns empty object', () => {
    const expected = {};
    const result = listHelper.mostLikes(blogs.noBlogs);
    assert.deepStrictEqual(result, expected);
  });
});
