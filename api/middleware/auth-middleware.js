const User = require('../users/users-model')

function checkNameAndPass(req, res, next) {
    if (!req.body.password || !req.body.username) {
      next({ status: 422, message: 'username and password required' })
    } else {
      next()
    }
}

async function checkUsernameFree(req, res, next) {
    try {
      const users = await User.findBy(req.body.username);
      if (!users.length) {
        next()
      } else {
        next({ status: 422, message: 'username taken' })
      }
    } catch (err) {
      next(err)
    } 
  }
  
  module.exports = { checkNameAndPass, checkUsernameFree }