const express = require('express')
const router = express.Router()

const pedidoController = require('../controllers/pedidoController')
const verificaToken = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')


router.post('/pedidos', verificaToken, pedidoController.criar)
router.get('/pedidos/meus-pedidos', verificaToken, pedidoController.meusPedidos)
router.get('/pedidos', verificaToken, isAdmin, pedidoController.listar)
router.get('/pedidos/:id', verificaToken, pedidoController.buscarPorId)
router.patch('/pedidos/:id', verificaToken, isAdmin, pedidoController.atualizarStatus)

module.exports = router
