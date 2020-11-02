const routes = require('express').Router()

routes.get('/', (request, response) => {
  return response.redirect('/teachers')
})

routes.get('/teachers', (request, response) => {
  return response.render('teachers/index')
})

routes.get('/students', (request, response) => {
  return response.render('students/index')
})

module.exports = routes