const express = require('express')
const nunjucks = require('nunjucks')

const server = express()

server.use(express.static('public'))

server.set('view engine', 'njk')

nunjucks.configure('views', {
    express: server
})


server.use(require('./routes'))
// server.use((req, res) => {
//     return res.status(404).render('not-found')
// })

server.listen(3333, () => {
    console.log('> Server runing')
})