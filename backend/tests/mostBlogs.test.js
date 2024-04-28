const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const blogs = require('./blogLists');

describe('most blogs', () => {
  test('most blogs on filled list returns author with most blogs', () => {
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3,
    };
    const result = listHelper.mostBlogs(blogs.multipleBlogs);
    assert.deepStrictEqual(result, expected);
  });

  test('most blogs on list with one blog returns that author', () => {
    const expected = {
      author: 'Robert C. Martin',
      blogs: 1,
    };
    const result = listHelper.mostBlogs(blogs.oneBlog);
    assert.deepStrictEqual(result, expected);
  });

  test('most blogs on empty list returns empty object', () => {
    const expected = {};
    const result = listHelper.mostBlogs(blogs.noBlogs);
    assert.deepStrictEqual(result, expected);
  });
});
