const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Business = require("../models/business");
const Vendor = require('../models/vendor')

const getBusinesses = async (req, res, next) => {
  try {
    businesses = await Business.find()
  } catch (err) {
    const error = res.status(500).send({ error: 'Fetching products failed, Plzz try again later' })
    return next(error)
  }

  if (businesses.length === 0) {
    const error = res.status(404).send({ error: "No Products Available" })
    return next(error)
  }
  res.json({ businesses: businesses.map(business => business.toObject({ getters: true })) })

}

const getBusinessesByVendorId = async (req, res, next) => {
  const vendorId = req.params.uid;
  let vendorWithBusinesses;
  try {
    vendorWithBusinesses = await Vendor.findById(vendorId).populate("businesses");
  } catch (err) {
    const error = new HttpError("Fetching places failed, Try Later", 500);
    return next(error);
  }

  if (!vendorWithBusinesses || vendorWithBusinesses.businesses.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user ID", 404)
    );
  }
  res.json({
    businesses: vendorWithBusinesses.businesses.map((business) =>
      business.toObject({ getters: true })
    ),
  });
};
const createBusinessListing = async (req, res, next) => {
  const errors = validationResult(req);
  console.log("category")
  if (!errors.isEmpty()) {
    const error = res.status(422).send('Invalid Inputs, Please Check you Data')
    throw new error
  } 
  let vendor;
  try {
    vendor = await Vendor.findById(req.userData.userId);
  } catch (err) {
    const error = res.status(500).send({ error: "Something went wrong, can't add to the Cart" })
    return next(error);
  }

  if (!vendor) {
    const error = res.status(404).send({ error: "Could not find user for provided Id" })
    return next(error);
  }
  
  const {category, suitable, tags } = req.body;

  const createdListing = new Business({
    title:"Business",
    category,
    suitable,
    tags,
    owner: req.userData.userId
  });
  console.log(createdListing)

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdListing.save({ session: sess });
    vendor.businesses.push(createdListing);
    await vendor.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = res.status(500).json({ error: "Something went wrong, can't add to the Orders" })
    return next(error)
  }

  res.status(201).json({ business: createdListing });
}

const addToCart = async (req, res, next) => {
  const productId = req.params.pid
  let product
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = res.status(500).send({ error: "Something went wrong, Couldn't be added to the Cart" })
    return next(error)
  }

  if (!product) {
    const error = res.status(404).send({ error: "Could not find the product" })
    return next(error);
  }

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = res.status(500).send({ error: "Something went wrong, can't add to the Cart" })
    return next(error);
  }

  if (!user) {
    const error = res.status(404).send({ error: "Could not find user for provided Id" })
    return next(error);
  }

  try {
    user.cart.push(product)
    await user.save()
  } catch (err) {
    const error = res.status(500).send({ error: "Something went wrong, can't add to the Cart" })
    return next(error)
  }
  res.status(201).json('Added to Cart Successfully')
}

const addToOrders = async (req, res, next) => {
  const productId = req.params.pid
  let product
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = res.status(500).json({ error: "Something went wrong, Couldn't Place Order" })
    return next(error)
  }

  if (!product) {
    const error = res.status(404).json({ error: "Could not find the product" })
    return next(error);
  }

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = res.status(500).json({ error: "Something went wrong, can't add to the Cart" })
    return next(error);
  }

  if (!user) {
    const error = res.status(404).json({ error: "User doesn't exist" })
    return next(error);
  }

  if (product.availability === 0) {
    const error = res.status(404).json({ error: "Product Unavailable" })
    return next(error)
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    product.availability--
    await product.save({ session: sess });
    user.orders.push(product);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = res.status(500).json({ error: "Something went wrong, can't add to the Orders" })
    return next(error)
  }
  res.status(201).json({ product: product.toObject({ getters: true }) })
}

const getCartByUserId = async (req, res, next) => {
  const userId = req.userData.userId

  let userWithCart
  try {
    userWithCart = await User.findById(userId).populate('cart')
  } catch (err) {
    const error = res.status(500).json({ error: "Something went wrong, can't add to the Cart" })
    return next(error)
  }

  if (!userWithCart || userWithCart.cart.length === 0) {
    const error = res.status(404).json({ error: 'Could not find products in the Cart for the provided user ID' })
    return next(error)
  }
  res.json({
    products: userWithCart.cart.map((product) =>
      product.toObject({ getters: true })
    ),
  })
}

const getOrdersByUserId = async (req, res, next) => {
  const userId = req.userData.userId

  let userOrders
  try {
    userOrders = await User.findById(userId).populate('orders')
  } catch (err) {
    const error = res.status(500).json({ error: "Something went wrong, can't Place Orders" })
    return next(error)
  }

  if (!userOrders || userOrders.orders.length === 0) {
    const error = res.status(404).json({ error: 'No orders found  ' })
    return next(error)
  }
  res.json({
    products: userOrders.orders.map((product) =>
      product.toObject({ getters: true })
    ),
  })
}

const deleteFromCart = async (req, res, next) => {
  const productId = req.params.pid

  let user
  try {
    user = await User.findById(req.userData.userId).populate('cart')
  } catch (err) {
    const error = res.status(500).json({ error: "Something went wrong, Couldn't delete the product" })
    return next(error)
  }

  if (!user || user.cart.length === 0) {
    const error = res.status(404).json({ error: 'Could not find productsin the Cart for the provided user ID' })
    return next(error)
  }

  let product
  try {
    product = await Product.findById(productId)
  } catch (err) {
    const error = res.status(500).json({ error: "Something went wrong, Couldn't delete the product" })
    return next(error);
  }
  if (!product) {
    const error = res.status(404).json({ error: "Could not find product for the provided ID" })
    return next(error);
  }

  try {
    user.cart.pull(product);
    await user.save();
  } catch (err) {
    const error = res.status(500).json({ error: "Something went wrong, Couldn't delete the product" })
    return next(error);
  }

  res.status(200).json({ message: "Product Successfully Removed from the Cart" })
}

const deleteFromOrders = async (req, res, next) => {
  const productId = req.params.pid

  let user
  try {
    user = await User.findById(req.userData.userId).populate('orders')
  } catch (err) {
    const error = res.status(500).json({ error: "Something went wrong, Couldn't Cancel order" })
    return next(error)
  }

  if (!user || user.orders.length === 0) {
    const error = res.status(404).json({ error: 'No Orders Found for the requested User' })
    return next(error)
  }

  let product
  try {
    product = await Product.findById(productId)
  } catch (err) {
    const error = res.status(500).json({ error: "Something went wrong, Couldn't Cancel order" })
    return next(error);
  }
  if (!product) {
    const error = res.status(404).json({ error: "Could not find product for the provided ID" })
    return next(error);
  }

  try {
    user.orders.pull(product);
    await user.save();
  } catch (err) {
    const error = res.status(500).json({ error: "Something went wrong, Couldn't Cancel the order" })
    return next(error);
  }

  res.status(200).json({ message: "Order cancelled Successfully" })
}

const addReview = async (req, res, next) => {
  const productId = req.params.pid

  let product
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = res.status(500).json({ error: "Something went wrong, Couldn't add Review" })
    return next(error)
  }

  if (!product) {
    const error = res.status(404).json({ error: "Could not find the product" })
    return next(error);
  }

  let user
  try {
    user = await User.findById(req.userData.userId)
  } catch (err) {
    const error = res.status(500).json({ error: "Something went wrong, Couldn't Add Review" })
    return next(error)
  }

  if (!user || user.orders.length === 0) {
    const error = res.status(404).json({ error: 'Only Buyers can add the Review' })
    return next(error)
  }

  let orderId
  try {
    orderId = user.orders.includes(productId)
  } catch (err) {
    const error = res.status(500).json({ error: "Something went wrong, Couldn't Add Review" })
    return next(error)
  }

  if (!orderId) {
    const error = res.status(404).json({ error: 'Only Buyers can add the Review' })
    return next(error)
  }

  const { name, comment } = req.body
  try {
    product.review.push({
      name: user.name,
      comment
    })
    await product.save()
  } catch (err) {
    const error = res.status(500).json({ error: "Something went wrong, can't add Review" })
    return next(error)
  }
  res.status(201).json({ product })

}


exports.createBusinessListing = createBusinessListing
exports.getBusinessesByVendorId = getBusinessesByVendorId
exports.getBusinesses = getBusinesses
