const connection = require('./connection')
const config = require('../config')

const create = (id, sale_id) => new Promise((res, rej) => {
  const query = 'INSERT INTO saled_products(product_id, sale_id) VALUES (?,?)'
  connection.query(query, [id, sale_id], (error) => {
    if (error) {
      rej(`Услуги по договору: ${config.ERRORS.UNKNOWN}`)
    } else {
      res()
    }
  })
})

const get = (deal_id) => new Promise((res, rej) => {
  const query = 'SELECT * FROM deal_products WHERE deal_id = ?'
  connection.query(query, [deal_id], (error, results) => {
    if (error) {
      rej(`Услуги по договору: ${config.ERRORS.UNKNOWN}`)
    } else {
      res(results)
    }
  })
})

const remove = ({ id }) => new Promise((res, rej) => {
  const query = 'DELETE FROM deal_products WHERE deal_id = ?'
  connection.query(query, [id], (error) => {
    if (error) {
      rej(`Услуги по договору: ${config.ERRORS.UNKNOWN}`)
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