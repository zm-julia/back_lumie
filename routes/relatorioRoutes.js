const express = require('express')
const router = express.Router()

const relatorioController = require('../controllers/relatorioController')
const verificaToken = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')

router.get('/relatorios/vendas', verificaToken, isAdmin, relatorioController.vendasPorCategoria)
router.get('/relatorios/estoque', verificaToken, isAdmin, relatorioController.situacaoEstoque)

module.exports = router
