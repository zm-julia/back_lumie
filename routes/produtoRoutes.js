const express = require('express')
const router = express.Router()

const produtoController = require('../controllers/produtoController')
const verificaToken = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')


router.get('/produtos/buscar', produtoController.buscarPorNome)
router.get('/produtos', produtoController.listar)
router.get('/produtos/:id', produtoController.buscarPorId)


router.post('/produtos', verificaToken, isAdmin, produtoController.cadastrar)
router.put('/produtos/:id', verificaToken, isAdmin, produtoController.atualizar)
router.patch('/produtos/:id', verificaToken, isAdmin, produtoController.atualizarParcial)
router.delete('/produtos/:id', verificaToken, isAdmin, produtoController.apagar)

module.exports = router
