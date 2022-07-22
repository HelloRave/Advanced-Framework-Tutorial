const express = require('express')
const router = express.Router();

const {Product} = require('../models')
const {createProductForm, bootstrapField} = require('../forms')

router.get('/', async function(req, res){
    let products = await Product.collection().fetch();
    res.render('products/index',{
        products: products.toJSON()
    })

})

router.get('/create', function(req, res){
    const productForm = createProductForm();
    res.render('products/create', {
        form: productForm.toHTML(bootstrapField)
    })
})

router.post('/create', function(req, res){
    const productForm = createProductForm();
    productForm.handle(req,{
        success: async function(form){
            const product = new Product();
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            await product.save()
            res.redirect('/products')
        },
        error: function(form){
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        },
        empty: function(form){
            
        }
    })
})

module.exports = router