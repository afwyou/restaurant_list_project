const express = require('express')
const port = 3000
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const restaurantList = require('./restaurant.json')
mongoose.connect('mongodb://localhost/restaurant-list')
const Restaurant = require('./models/restaurant')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
// 告訴 Express 說要設定的 view engine 是 handlebars
app.set('view engine', 'handlebars')
//告訴express靜態檔案在哪裡
app.use(express.static('public'))
app.use((bodyParser.urlencoded({ extended: true })))

//取得資料庫連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})


////路由區
//瀏覽全部頁面
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.log(error))
})
//瀏覽餐廳細節
app.get('/restaurant/:id', (req, res) => {
  // const restaurants = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  // res.render('show', { restaurant: restaurants })
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', restaurant))
})
//搜尋餐廳
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurant: restaurants })
})

//新增資料(導向新增頁面)

app.get('/create', (req, res) => {
  return res.render('new')
})

//新增資料（操作資料庫 > 返回主頁）
app.post('/create/new', (req, res) => {
  const restaurant = req.body
  console.log(restaurant)
  return Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))

})

//修改餐廳
app.post('/restaurant/:id/edit', (req, res) => {
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
    .then(() => res.redirect(`/restaurant/${id}`))
    .catch(error => console.log(error))

})


app.listen(port, () => {
  console.log('Listen to the http://localhost:3000')
})