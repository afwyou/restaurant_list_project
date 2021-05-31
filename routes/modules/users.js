const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  //這裡就會經過passport.js的運作
  successRedirect: '/',
  failureRedirect: '/users/login'
}))


router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  //如果errors[]裡面有東西，length就會有值，代表前面有寫到錯誤情形，就重新導向並保留原本的輸入值
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    return User.create({
      name,
      email,
      password
    })
      .then(() => res.redirect('/'))
      .catch((error) => console.log(error))
  })
})

router.get('/logout', (req, res) => {
  //Passport.js 提供的函式，會幫你清除 session
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')

})

module.exports = router