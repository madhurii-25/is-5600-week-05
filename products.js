const cuid = require('cuid')
const db = require('./db')

//MongoDB Model
const Product = db.model('Product', {
  _id: { type: String, default: cuid },
  description: String,
  alt_description: String,
  likes: { type: Number, required: true },
  urls: {
    regular: { type: String, required: true },
    small: { type: String, required: true },
    thumb: { type: String, required: true },
  },
  links: {
    self: { type: String, required: true },
    html: { type: String, required: true },
  },
  user: {
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: String,
    portfolio_url: String,
    username: { type: String, required: true },
  },
  tags: [{
    title: { type: String, required: true },
  }],
})

/**
 *CREATE product (MongoDB)
 */
async function create(fields) {
  return await new Product(fields).save()
}

/**
 *LIST products (MongoDB)
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options

  const query = tag
    ? { tags: { $elemMatch: { title: tag } } }
    : {}

  return await Product.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)
}

/**
 *GET product by ID (MongoDB)
 */
async function get(id) {
  return await Product.findById(id)
}

/**
 *EDIT product
 */
async function edit(id, change) {
  const product = await get(id)

  if (!product) {
    throw new Error('Product not found')
  }

  Object.keys(change).forEach(key => {
    product[key] = change[key]
  })

  await product.save()
  return product
}

/**
 *DELETE product
 */
async function destroy(id) {
  const result = await Product.deleteOne({ _id: id })
  return { deleted: result.deletedCount === 1 }
}

module.exports = {
  create,
  list,
  get,
  edit,
  destroy
}