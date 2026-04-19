const cuid = require('cuid')
const db = require('./db')

const Order = db.model('Order', {
  _id: { type: String, default: cuid },
  buyerEmail: { type: String, required: true },
  products: [{
    type: String,
    ref: 'Product',
    required: true
  }],
  status: {
    type: String,
    default: 'CREATED',
    enum: ['CREATED', 'PENDING', 'COMPLETED']
  }
})

async function list(options = {}) {
  const { offset = 0, limit = 25, productId, status } = options

  const query = {
    ...(productId ? { products: productId } : {}),
    ...(status ? { status } : {})
  }

  return await Order.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)
}

async function create(fields) {
  const order = await new Order(fields).save()
  return order
}

module.exports = {
  list,
  create
}