const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
const { update } = require('../../models/Product');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          as: 'tags',
          through: ProductTag,
          attributes: ['id', 'tag_name'],
        },
      ],
    });
    res.status(200).json(products);
  }catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          as: 'tags',
          through: ProductTag,
          attributes: ['id', 'tag_name'],
        },
      ],
    });

    if (!product) {
      res.status(404).json({
        message: 'Product not found'
      });
    } else {
    res.status(200).json(product);
    }
  }catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
  });

// create new product 
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  }catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if(!product) {
      res.status(404).json({
        message: 'Product not found'
      });
      return;
    }

    product.product_name = req.body.product_name || product.product_name;
    product.stock = req.body.stock || product.stock;
    await product.save();

    res.status(200).json(product);
  }catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error'
    })
  }
});

//WIP
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      res.status(404).json({
        messsage: 'Product not found'
      });
      return;
    }

    await product.destroy();

    res.status(200).json({
      message: 'Product deleted successfully'
    });
  }catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error'
    })
  }
});

module.exports = router;
