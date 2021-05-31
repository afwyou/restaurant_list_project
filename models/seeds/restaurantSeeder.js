const bcrypt = require('bcryptjs')
//seeder是獨立的js檔案，mongoose連線設定的變數已經移到環境變數
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('../seeds/restaurant.json')
const User = require('../user')
const users = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678'
  }
]

db.once('open', () => {
  users.forEach((user, index) => {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(user.password, salt))
      .then(hash => User.create({
        name: user.name,
        email: user.email,
        password: hash
      }))
      .then(user => {
        const userId = user._id
        return Promise.all(Array.from({ length: 3 }, (_, i) => Restaurant.create(
          {
            //mongoose.create()參數是可以放陣列的
            ...restaurantList.results[i + (index * 3)], userId
          }
        )))
      })
      .then(() => {
        console.log('seeder loaded.')
        process.exit()
      })
  })
})