const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isloggedIn, isNotloggedIn } = require('../lib/auth');

router.get('/signup', isNotloggedIn, (req, res) => {
    res.render('auth/signup')
});

router.post('/signup', isNotloggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}))

router.get('/signin', isNotloggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotloggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isloggedIn, (req, res) => {
    res.render('profile');
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;