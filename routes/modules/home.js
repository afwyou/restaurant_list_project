// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 Todo model
const Restaurant = require('../../models/restaurant')
// 定義首頁路由
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' }) // desc
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.error(error))
})


//新增資料(導向新增頁面)

router.get('/new', (req, res) => {
  return res.render('new')
})
// 匯出路由模組
module.exports = router