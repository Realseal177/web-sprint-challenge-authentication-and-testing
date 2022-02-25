const jwt = require('jsonwebtoken')
const { TOKEN_SECRET } = require('../config');

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

module.exports = {
  restricted,
};
