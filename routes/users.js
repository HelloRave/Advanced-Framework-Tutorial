const express = require('express');
const { createUserForm, bootstrapField, createLoginForm } = require('../forms');
const { User } = require('../models');
const router = express.Router();
const crypto = require('crypto')

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256')
    const hash = sha256.update(password).digest('base64')
    return hash 
}

router.get('/signup', async function(req, res){
    const userForm = createUserForm();
    res.render('users/signup', {
        form: userForm.toHTML(bootstrapField)
    })
})

router.post('/signup', async function(req, res){
    const userForm = createUserForm();
    userForm.handle(req, {
        success: async function(form){
            const user = new User({
                username: form.data.username,
                password: getHashedPassword(form.data.password), 
                email: form.data.email
            });
            await user.save()
            req.flash('success_messages', 'User signed up successfully!');
            res.redirect('/users/login')

        },
        error: function(form){
            res.render('users/signup', {
                form: form.toHTML(bootstrapField)
            })
        },
        empty: function(form){
            res.render('users/signup', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login', async function(req, res){
    const loginForm = createLoginForm();
    res.render('users/login', {
        form: loginForm.toHTML(bootstrapField)
    })
})

router.post('/login', async function(req, res){
    const loginForm = createLoginForm();
    loginForm.handle(req,{
        success: async function(form){
            const user = await User.where({
                email: form.data.email,
                password: getHashedPassword(form.data.password)
            }).fetch({
                require: false
            })

            if (!user){
                req.flash('error_messages', 'Invalid credentials');
                res.redirect('users/login')
            } else {
                req.session.user = {
                    id: user.get('id'),
                    email: user.get('email'),
                    username: user.get('username')
                }
                req.flash('success_messages', `Welcome back ${user.get('username')}`)
                res.redirect('/products')
            }
        }
    })
})

router.get('/profile', async function(req,res){
    const user = req.session.user;
    if (!user){
        req.flash('error_messages', 'Only logged in users may view this page')
    } else {
        res.render('users/profile', {
            user: req.session.user
        })
    }
})

router.get('/logout', function(req, res){
    req.session.user = null;
    req.flash('success_messages', 'Goodbye')
    res.redirect('/users/login')
})

module.exports = router