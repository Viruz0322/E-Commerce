const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try{
    const tags = await Tag.findAll({
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
          through: ProductTag,
          as: 'products'
        },
      ],
    });
    res.status(200).json(tags);
  }catch (error) {
    res.status(500).json({
      message: 'Server Error'
    });
  }
});

router.get('/:id', async  (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try{
    const tag = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
          through: ProductTag,
          as: 'products'
        },
      ],
    });
    
    if(!tag) {
      res.status(404).json({
        message: 'Tag not found'
      });
    } else {
      res.status(200).json(tag);
    }
  }catch (error) {
    res.status(500).json({
      message: 'Server Error'
    })
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try{
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  }catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    })
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updatedTag = await Tag.update(
      { tag_name: req.body.tag_name },
      { where: { id: req.params.id } }
    );
    if(updatedTag[0] === 0) {
      res.status(404).json({
        message: 'No tag found with this id'
      });
      return;
    }
    res.status(200).json({
      message: 'Tag updated successfully'
    });
  }catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    });
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deletedTag = await Tag.destroy({
      where: { id: req.params.id },
    });
    if (!deletedTag) {
      res.status(404).json({
        message: 'No tag found with this id'
      });
      return;
    }
    res.status(200).json({
      message: 'Tag deleted successfully'
    });
  }catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Server Error'
    })
  }
});

module.exports = router;
