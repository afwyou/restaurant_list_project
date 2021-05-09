const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

//瀏覽餐廳細節
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', restaurant))//沒有花括號，後面用this
})
//搜尋餐廳
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find()
    .lean()
    .then(restaurant => {
      return restaurant.filter(restaurant =>
        restaurant.name.toLowerCase().includes(keyword)
        || restaurant.name_en.toLowerCase().includes(keyword)
        || restaurant.category.toLowerCase().includes(keyword)
      )
    })
    .then(restaurant => res.render('index', { restaurant }))
    .catch(err => console.log(err))

})



//新增資料（操作資料庫 > 返回主頁）
router.post('/create', (req, res) => {
  const restaurant = req.body
  console.log(restaurant)
  return Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))

})

//修改餐廳
router.put('/:id', (req, res) => {
  const id = req.params.id
  console.log(id)
  return Restaurant.findById(id)
    .then(restaurant => {
      console.log(restaurant)
      restaurant.name = req.body.name
      restaurant.category = req.body.category
      restaurant.location = req.body.location
      restaurant.phone = req.body.phone
      restaurant.rating = req.body.rating
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))

})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


module.exports = router