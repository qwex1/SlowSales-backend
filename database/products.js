const connection = require('./connection')
const config = require('../config')

const create = ({ name, price }, org_id) => new Promise((res, rej) => {
  const query = 'INSERT INTO products(name, price, org_id) VALUES (?,?,?)'
  connection.query(query, [name, price, org_id], (error) => {
    if (error) {
      rej(config.ERRORS.UNKNOWN)
    } else {
      res()
    }
  })
})

const get = (org_id, extraQuery = '', extraParams = []) => new Promise((res, rej) => {
  const query = 'SELECT * FROM products WHERE org_id = ?' + extraQuery
  connection.query(query, [org_id, ...extraParams], (error, results) => {
    if (error) {
      rej(config.ERRORS.UNKNOWN)
    } else {
      res(results)
    }
  })
})

const remove = ({ id }) => new Promise((res, rej) => {
  const query = 'DELETE FROM products WHERE id = ?'
  connection.query(query, [id], (error) => {
    if (error) {
      if (error.errno === 1451) {
        rej(config.ERRORS.SERVICE_IS_USED)
      }
      else {
        rej(config.ERRORS.UNKNOWN)
      }
    } else {
      res()
    }
  })
})

module.exports = {
  create,
  get,
  remove
}