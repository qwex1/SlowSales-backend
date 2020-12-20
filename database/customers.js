const connection = require('./connection')
const config = require('../config')

const create = ({ name, phone, city, register_date }, org_id) => new Promise((res, rej) => {
  const query = 'INSERT INTO customers(name, phone, city, register_date, org_id) VALUES (?,?,?,?,?)'
  connection.query(query, [name, phone, city, register_date, org_id], (error, results) => {
    if (error) {
      if (error.errno === 1062) rej(config.ERRORS.CUSTOMER_EXISTS)
      else rej(`Заказчики: ${config.ERRORS.UNKNOWN}`)
    } else {
      res(results.insertId)
    }
  })
})

const get = (org_id, extraQuery = '', extraParams = []) => new Promise((res, rej) => {
  const query = 'SELECT * FROM customers WHERE org_id = ?' + extraQuery
  connection.query(query, [org_id, ...extraParams], (error, results) => {
    if (error) {
      rej(`Заказчики: ${config.ERRORS.UNKNOWN}`)
    } else {
      res(results)
    }
  })
})

const getRegulars = (org_id, extraQuery = '', extraParams = []) => new Promise((res, rej) => {
  const query = `SELECT customers.*, num_deals, amount FROM customers
  LEFT JOIN regulars ON regulars.id = customers.id
  WHERE customers.org_id = ? AND customers.id IN (SELECT id FROM regulars)` + extraQuery
  connection.query(query, [org_id, ...extraParams], (error, results) => {
    if (error) {
      rej(`Заказчики: ${config.ERRORS.UNKNOWN}`)
    } else {
      res(results)
    }
  })
})

module.exports = {
  create,
  get,
  getRegulars,
}