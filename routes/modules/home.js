// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 Todo model
const Restaurant = require('../../models/restaurant')
// 定義首頁路由
router.get('/', (req, res) => {
  const userId = req.user._id//req.user在passport.js的序列化程序已經取得
  return Restaurant.find({ userId })
    .lean()
    .sort({ _id: 'asc' }) // desc
    .then(restaurant =>
      res.render('index', { restaurant }))
    .catch(error => console.error(error))
})


// 匯出路由模組
module.exports = router