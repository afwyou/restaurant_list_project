const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
//路由也會由上而下一一比對
//當/new跑到/:id時，id變成new
//const _id = req.params.id    _id就變成new
//Restaurant.findOne({ _id,userId })  
//CastError: Cast to ObjectId failed for value "new" at path "_id" for model "Restaurant"
//model Restaurant 找不到_id，'new' is not a valid ObjectId so the cast fails
//https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id

//新增資料（操作資料庫 > 返回主頁）
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/create', (req, res) => {
  const userId = req.user._id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.create({
    name, name_en, category, image, location, phone, google_map, rating, description, userId: req.user._id
  })
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})


// //瀏覽餐廳細節
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => {
      res.render('show', restaurant)
    })//沒有花括號，後面用this
    .catch(error => console.error(error))
})
//搜尋餐廳
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find()
    .lean()
    .then(restaurant => {
      return restaurant.filter(restaurants =>
        restaurants.name.toLowerCase().includes(keyword)
        || restaurants.name_en.toLowerCase().includes(keyword)
        || restaurants.category.toLowerCase().includes(keyword)
      )
    })
    .then(restaurant => res.render('index', { restaurant }))
    .catch(err => console.log(err))

})





//修改餐廳
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, category, location, phone, rating } = req.body
  // console.log(id)
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => {
      // console.log(restaurant)
      restaurant.name = name
      restaurant.category = category
      restaurant.location = location
      restaurant.phone = phone
      restaurant.rating = rating
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))

})

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


module.exports = router