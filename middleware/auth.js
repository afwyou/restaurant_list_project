module.exports = {
  authenticator: (req, res, next) => {
    //req.isAuthenticated()為Passport.js 提供的函式，會根據 request 的登入狀態回傳 true 或 false
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/users/login')
  }
}