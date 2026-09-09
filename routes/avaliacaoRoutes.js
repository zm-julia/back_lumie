const express = require('express')
const router = express.Router()

const avaliacaoController = require('../controllers/avaliacaoController')
const verificaToken = require('../middlewares/auth')

// Rota pública: qualquer visitante pode ver as avaliações de um profissional
router.get('/avaliacoes', avaliacaoController.listar)

// Rota privada: só cliente logado pode avaliar
router.post('/avaliacoes', verificaToken, avaliacaoController.criar)

module.exports = router
