const express = require('express')
const router = express.Router();

const { Product } = require('../models')
const { createProductForm, bootstrapField } = require('../forms')

router.get('/', async function (req, res) {
    let products = await Product.collection().fetch();
    res.render('products/index', {
        products: products.toJSON()
    })

})

router.get('/create', function (req, res) {
    const productForm = createProductForm();
    res.render('products/create', {
        form: productForm.toHTML(bootstrapField)
    })
})

router.post('/create', function (req, res) {
    const productForm = createProductForm();
    productForm.handle(req, {
        success: async function (form) {
            const product = new Product();
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            await product.save()
            res.redirect('/products')
        },
        error: function (form) {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        },
        empty: function (form) {
        }
    })
})

router.get('/:product_id/update', async function (req, res) {
    // 1. get product being updated 
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    })
    // 2. create form to update the product
    const productForm = createProductForm()
    // 3. fill form with previous values
    productForm.fields.name.value = product.get('name')
    productForm.fields.cost.value = product.get('cost')
    productForm.fields.description.value = product.get('description')

    res.render('products/update', {
        form: productForm.toHTML(bootstrapField),
        product: product.toJSON()
    })
})

router.post('/:product_id/update', async function (req, res) {
    const productForm = createProductForm();

    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    })

    productForm.handle(req, {
        'success': async function (form) {
            product.set(form.data);
            await product.save()
            res.redirect('/products')
        },
        'error': async function (form) {
            res.render('products/update', {
                'product': product.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        },
        'empty': async function (form) {
            res.render('products/update', {
                'product': product.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:product_id/delete', async function(req, res){
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    })
    
    res.render('products/delete',{
        product: product.toJSON()
    })
})

router.post('/:product_id/delete', async function(req, res){
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    })

    await product.destroy();
    res.redirect('/products')
})
module.exports = router