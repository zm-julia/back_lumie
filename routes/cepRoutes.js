const express = require('express')
const router = express.Router()

const cepController = require('../controllers/cepController')

router.get('/cep/:cep', cepController.buscar)

module.exports = router
