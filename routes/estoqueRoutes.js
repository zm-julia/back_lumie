const express = require('express')
const router = express.Router()

const estoqueController = require('../controllers/estoqueController')
const verificaToken = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')

router.get('/estoque', verificaToken, isAdmin, estoqueController.listar)
router.get('/estoque/:id', verificaToken, isAdmin, estoqueController.buscarPorId)
router.post('/estoque', verificaToken, isAdmin, estoqueController.movimentar)
router.put('/estoque/:id', verificaToken, isAdmin, estoqueController.atualizar)

module.exports = router
