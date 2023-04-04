const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    //find ALL and INCLUDE the product tied to it
    //INCLUDE takes an array of objects with each having a MODEL
    const categories = await Category.findAll({
      include: [{
        model: Product
      }],
    });
    //200 = OK
    res.status(200).json(categories);
  }catch (error) {
    console.error(error);
    //500 = Server Error
    res.status(500).json({
      message: 'Server Error'
    });
  }
});

router.get('/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
      //instead of Find ALL we look for ONE category and its attatched PRODUCTs
      const category = await Category.findOne({
        //specify which category you want using WHERE
        where: { id: categoryId },
        include: [{
          model: Product
        }],
      });
      //!category = it returns false
      if (!category) {
        //404 = Not Found
        res.status(404).json({
          message: 'Category not found'
        });
      } else {
        res.status(200).json(category);
      }
    }catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/', async (req, res) => {
  const categoryData = req.body;
  try {
    const newCategory = await Category.create(categoryData);
    //201 = created
    res.status(201).json(newCategory);
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
  
  
router.put('/:id', async (req, res) => {
  //take in the category data from the request
  const categoryId = req.params.id;
  const updatedCategoryData = req.body;
  try {
    //pass the category data to the update
    const [numRowsUpdated, updatedCategories] = await Category.update(
      updatedCategoryData,
      {
        //find the specified id using WHERE
        where: { id: categoryId }, returning: true
      });
      //if no changes to the row were made then it failed
      if (numRowsUpdated === 0) {
        res.status(404).json({
          message: 'Category not found'
        });
      }else {
        res.status(200).json(updatedCategories[0]);
      }
    }catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Server Error'
      });
    }
  });




  router.delete('/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
      //destory returns with a number of rows deleted based on the id passed in
      const numRowsDeleted = await Category.destroy({
        where: { id: categoryId },
      });
      if (numRowsDeleted === 0) {
        res.status(404).json({
          message: 'Category not found'
        });
      } else {
        res.status(204).end();
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Server Error'
      });
    }
  });

module.exports = router;
