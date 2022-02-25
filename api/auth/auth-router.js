const bcrypt = require('bcryptjs')
const router = require('express').Router();

const jwt = require('jsonwebtoken')
const { TOKEN_SECRET } = require('../../api/config/index')
const { checkUsernameFree, checkNameAndPass } = require('../middleware/auth-middleware')

const User = require('../users/users-model')

function buildToken(user) {
  const payload = {
    username: user.username
  }
  const options = {
    expiresIn: '1d'
  }
  return jwt.sign(payload, TOKEN_SECRET, options);
}

router.post('/register', checkNameAndPass, checkUsernameFree, (req, res, next) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;
  User.add(user)
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(next)
});

router.post('/login', checkNameAndPass, (req, res, next) => {
  let { username, password } = req.body;

  User.findBy(username)
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = buildToken(user)
        res.status(200).json({
          message: 'welcome, Captain Marvel',
          token: token
        })
      } else {
        next({ status: 401, message: 'invalid credentials' })
      }
    })
});

module.exports = router;
