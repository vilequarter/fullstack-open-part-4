const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const blogs = require('./blogLists');

describe('dummy', () => {
  test('empty list returns one', () => {
    const result = listHelper.dummy(blogs.noBlogs);
    assert.strictEqual(result, 1);
  });

  test('filled list returns one', () => {
    const result = listHelper.dummy(blogs.multipleBlogs);
    assert.strictEqual(result, 1);
  });

  test('single blog returns one', () => {
    const result = listHelper.dummy(blogs.oneBlog);
    assert.strictEqual(result, 1);
  });
});
