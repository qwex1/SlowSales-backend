const connection = require('./connection')
const config = require('../config')

const create = ({ customer_id, date }, org_id, manager_id) => new Promise((res, rej) => {
  const query = 'INSERT INTO sales(customer_id, date, org_id, manager_id) VALUES (?,?,?,?)'
  connection.query(query, [customer_id, date, org_id, manager_id], (error, results) => {
    if (error) {
      rej(`Сделки: ${config.ERRORS.UNKNOWN}`)
    } else {
      res(results.insertId)
    }
  })
})

const get = (org_id, extraQuery = '', extraParams = []) => new Promise((res, rej) => {
  const query = 'SELECT * FROM sales_view WHERE org_id = ?' + extraQuery
  connection.query(query, [org_id, ...extraParams], (error, results) => {
    if (error) {
      rej(`Сделки: ${config.ERRORS.UNKNOWN}`)
    } else {
      res(results)
    }
  })
})

const remove = ({ id }) => new Promise((res, rej) => {
  const query = 'DELETE FROM sales WHERE id = ?'
  connection.query(query, [id], (error) => {
    if (error) {
      rej(`Сделки: ${config.ERRORS.UNKNOWN}`)
    } else {
      res()
    }
  })
})

module.exports = {
  create,
  get,
  remove,
}