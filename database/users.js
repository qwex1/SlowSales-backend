const connection = require('./connection')
const bcrypt = require('bcrypt')
const config = require('../config')

const saltRounds = 10;

const create = ({ email, username, password }, org_id, role) => new Promise((res, rej) => {
  bcrypt.hash(password, saltRounds, (err, hash) => {
    const query = 'INSERT INTO users(email, name, password, org_id, role) VALUES(?,?,?,?,?)'
    connection.query(query, [email, username, hash, org_id, role], (error) => {
      if (error) {
        if (error.errno === 1062) rej(config.ERRORS.USER_EXISTS)
        else rej(config.ERRORS.UNKNOWN)
      } else {
        res()
      }
    })
  })
})  

const me = (id) => new Promise((res, rej) => {
  const query = `SELECT users.name AS username, users.email AS user_email, organizations.name AS org_name FROM users 
  LEFT JOIN organizations on users.org_id = organizations.id
  WHERE users.id = ?`
  connection.query(query, [id], (error, results) => {
    if (error) {
      rej(config.ERRORS.EMAIL_NOT_FOUND)
    } else {
        res(results[0])
    }
  })
})
const get = (username, password) => new Promise((res, rej) => {
  const query = 'SELECT * FROM users WHERE email = ?'
  connection.query(query, [username], (error, results) => {
    if (error) {
      rej(config.ERRORS.EMAIL_NOT_FOUND)
    } else {
      bcrypt.compare(password, results[0].password, (error, found) => {
        if (error) rej(config.ERRORS.UNKNOWN)
        else if (!found) rej(config.ERRORS.INCORRECT_PASSWORD)
        else res(results[0])
      })
    }
  })
})

const getTop = (org_id, extraQuery = '', extraParams = []) => new Promise((res, rej) => {
    const query = `SELECT users.*, num_deals, amount FROM users
    LEFT JOIN top_managers ON top_managers.id = users.id
    WHERE users.org_id = ? AND users.id IN (SELECT id FROM top_managers)` + extraQuery
    connection.query(query, [org_id, ...extraParams], (error, results) => {
      if (error) {
        rej(`Заказчики: ${config.ERRORS.UNKNOWN}`)
      } else {
        res(results)
      }
    })
  })

const getAll = (org_id) => new Promise((res, rej) => {
  const query = 'SELECT id, name, email, role FROM users WHERE org_id = ? AND role < 3'
  connection.query(query, [org_id], (error, results) => {
    if (error) {
      rej(config.ERRORS.EMAIL_NOT_FOUND)
    } else {
      res(results)
    }
  })
})

module.exports = {
  create,
  get,
  me,
  getTop,
  getAll,
}