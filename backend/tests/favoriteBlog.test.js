const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const blogs = require('./blogLists');

describe('favorite blog', () => {
  test('favorite blog returns most likes from filled list', () => {
    const expected = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    };
    const result = listHelper.favoriteBlog(blogs.multipleBlogs);
    assert.deepStrictEqual(result, expected);
  });

  test('favorite blog list with one blog returns that blog', () => {
    const expected = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      likes: 10,
    };
    const result = listHelper.favoriteBlog(blogs.oneBlog);
    assert.deepStrictEqual(result, expected);
  });

  test('favorite blog on empty list returns empty object', () => {
    const expected = {};
    const result = listHelper.favoriteBlog(blogs.noBlogs);
    assert.deepStrictEqual(result, expected);
  });
});
