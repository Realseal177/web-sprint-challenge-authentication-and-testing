const jwt = require('jsonwebtoken')
const { TOKEN_SECRET } = require('../../api/config/index');

const User = require('../users/users-model')

const restricted = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if (err) {
        next({ status: 401, message: `token invalid` })
      } else {
        req.decodedJwt = decoded;
        next()
      }
    })
  } else {
    next({ status: 401, message: 'token required' })
  }
}

async function checkUsernameFree(req, res, next) {
  try {
    const users = await User.findBy({ username: req.body.username });
    if (!users.length) {
      next()
    } else {
      next({ status: 422, message: 'username taken' })
    }
  } catch (err) {
    next(err)
  } 
}

function checkNameAndPass(req, res, next) {
  if (!req.body.password || !req.body.username) {
    next({ status: 422, message: 'username and password required' })
  } else {
    next()
  }
}





module.exports = {
  restricted,
  checkUsernameFree,
  checkNameAndPass
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
