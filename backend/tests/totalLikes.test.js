const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const blogs = require('./blogLists');

describe('total likes', () => {
  test('total likes gives correct sum of list with multiple items', () => {
    const result = listHelper.totalLikes(blogs.multipleBlogs);
    assert.strictEqual(result, 36);
  });

  test('total likes on list with one blog returns likes of the blog', () => {
    const result = listHelper.totalLikes(blogs.oneBlog);
    assert.strictEqual(result, 10);
  });

  test('total likes on list with no blogs returns zero', () => {
    const result = listHelper.totalLikes(blogs.noBlogs);
    assert.strictEqual(result, 0);
  });
});
