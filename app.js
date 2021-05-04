const express = require('express')
const port = 3000
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const restaurantList = require('./restaurant.json')
mongoose.connect('mongodb://localhost/restaurant-list')
const Restaurant = require('./models/restaurant')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
// 告訴 Express 說要設定的 view engine 是 handlebars
app.set('view engine', 'handlebars')
//告訴express靜態檔案在哪裡
app.use(express.static('public'))

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
app.get('/restaurant/:restaurant_id', (req, res) => {
  const restaurants = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurants })
})
//搜尋餐廳
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurant: restaurants })
})

app.listen(port, () => {
  console.log('Listen to the http://localhost:3000')
})