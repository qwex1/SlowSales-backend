const connection = require('./connection')
const config = require('../config')

const create = ({ name, email }) => new Promise((res, rej) => {
  const query = 'INSERT INTO organizations(name, email) VALUES (?,?)'
  connection.query(query, [name, email], (error, results) => {
    if (error) {
      if (error.errno === 1062) rej(config.ERRORS.COMPANY_EXISTS)
      else rej(config.ERRORS.UNKNOWN)
    } else {
      res(results.insertId)
    }
  })
})

module.exports = {
  create,
}