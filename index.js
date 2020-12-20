const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const db = require('./database')
const config = require('./config')
const passport = require('./passport')

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.status(200).send('<h1>Hello</h1>')
})

app.post('/signup', (req, res) => {
  db.organizations.create(req.body)
    .then((id) => {
      db.users.create(req.body, id, config.ROLES.ADMIN)
        .then(() => res.sendStatus(200))
        .catch(() => res.status(400).json({message: error.message }))
    })
    .catch((error) => {
      res.status(401).json({ message: error.message })
    })
})

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (_, user, info) => {
      if (user.id) {
        const token = jwt.sign({ id: user.id, role: user.role, org_id: user.org_id }, config.SECRET_KEY)
        res.cookie('session_token', token, { httpOnly: true, secure: false });
        res.status(200).send({ token })
      } else {
        res.status(401).send(info)
      }
    })(req, res, next)
})

app.post('/me', (req, res, next) => {
    passport.authenticate('jwt', (error, user) => {
      if (error || !user.id) {
        res.sendStatus(403);
      }
      else {
        db.users.me(user.id)
          .then((results) => res.json(results))
          .catch((error) => res.status(400).json(error))
      }
    })(req, res, next)
})

app.post('/get-customers', (req, res, next) => {
    passport.authenticate('jwt', (error, user) => {
      if (error || !user.id) {
        res.sendStatus(403);
      }
      else {
        db.customers.get(user.org_id)
          .then((result) => res.json(result))
          .catch((error) => res.status(400).json(error))
      }
    })(req, res, next)
})

app.post('/create-customer', (req, res, next) => {
    passport.authenticate('jwt', (error, user) => {
      if (error || !user.id) {
        res.sendStatus(403);
      }
      else {
        db.customers.create(req.body, user.org_id)
          .then((result) => res.json(result))
          .catch((error) => res.status(400).json(error))
      }
    })(req, res, next)
})

app.post('/get-regulars', (req, res, next) => {
    passport.authenticate('jwt', (error, user) => {
      if (error || !user.id) {
        res.sendStatus(403);
      }
      else {
        db.customers.getRegulars(user.org_id)
          .then((result) => res.json(result))
          .catch((error) => res.status(400).json(error))
      }
    })(req, res, next)
})

app.post('/create-user', (req, res, next) => {
    passport.authenticate('jwt', (error, user) => {
      if (error || !user.id || user.role > config.ROLES.MANAGER) {
        res.sendStatus(403)
      }
      else {
        db.users.create(req.body, user.org_id, req.body.role)
          .then(() => res.sendStatus(200))
          .catch((error) => res.status(400).json({ message: error }))
      }
    })(req, res, next)
})

app.post('/get-products', (req, res, next) => {
    passport.authenticate('jwt', (error, user) => {
      if (error || !user.id) {
        res.sendStatus(403);
      }
      else {
        db.products.get(user.org_id)
          .then((results) => res.json(results))
          .catch((error) => res.status(400).json(error))
      }
    })(req, res, next)
})

app.post('/create-sale', (req, res, next) => {
    passport.authenticate('jwt', (error, user) => {
      if (error || !user.id) {
          res.sendStatus(403);
      }
      else {
          const connectproducts = (saled_products, sale_id) => new Promise((resolve, reject) => {
              const promises = []
              saled_products.forEach(element => {
                  promises.push(db.saled_products.create(element, sale_id))
              })
              Promise.all(promises)
                  .then(() => {
                      db.connection.commit((commit_error) => {
                          if (!commit_error) { res.sendStatus(200); return }
                          db.connection.rollback(() =>  { throw config.ERRORS.UNKNOWN })
                      })
                  })
                  .catch((error) => db.connection.rollback(() =>  { throw error }))
          })
          db.sales.create(req.body, user.org_id, user.id)
              .then((sale_id) => {
                  connectproducts(req.body.saled_products, sale_id)
              })
              .catch((d_error) => db.connection.rollback(() => { 
                  if (!needRes) throw d_error
                  res.status(400).json({ error: d_error })
          }))
      }
    })(req, res, next)
})

app.post('/get-users', (req, res, next) => {
    passport.authenticate('jwt', (error, user) => {
      if (error || !user.id || user.role < config.ROLES.ADMIN) {
        res.sendStatus(403)
      }
      else {
        db.users.getAll(user.org_id)
          .then((result) => res.json(result))
          .catch((error) => res.status(400).json({ message: error }))
      }
    })(req, res, next)
})

app.post('/add-product', (req, res, next) => {
    passport.authenticate('jwt', (error, user, info) => {
      if (error || !user.id) {
        res.sendStatus(403);
      }
      else {
        db.products.create(req.body, user.org_id)
          .then(() => res.sendStatus(200))
          .catch((error) => res.status(400).json(error))
      }
    })(req, res, next)
})

app.post('/delete-product', (req, res, next) => {
    passport.authenticate('jwt', (error, user) => {
      if (error || !user.id) {
        res.sendStatus(403);
      }
      else {
        db.products.remove(req.body)
          .then(() => res.sendStatus(200))
          .catch((error) => res.status(400).json(error))
      }
    })(req, res, next)
})

app.post('/get-top-managers', (req, res, next) => {
    passport.authenticate('jwt', (error, user) => {
      if (error || !user.id) {
        res.sendStatus(403);
      }
      else {
        db.users.getTop(user.org_id)
          .then((result) => res.json(result))
          .catch((error) => res.status(400).json(error))
      }
    })(req, res, next)
})

app.post('/get-sales', (req, res, next) => {
    passport.authenticate('jwt', (error, user) => {
      if (error || !user.id) {
        res.sendStatus(403);
      }
      else {
        db.sales.get(user.org_id)
          .then((result) => res.json(result))
          .catch((error) => res.status(400).json(error))
      }
    })(req, res, next)
})

app.post('/delete-sale', (req, res, next) => {
    passport.authenticate('jwt', (error, user) => {
      if (error || !user.id) {
        res.sendStatus(403);
      }
      else {
        db.sales.remove(req.body)
          .then((result) => res.json(result))
          .catch((error) => res.status(400).json(error))
      }
    })(req, res, next)
})

app.listen(8081, () => console.log('app is running'))