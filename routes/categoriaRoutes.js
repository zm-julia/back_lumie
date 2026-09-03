const express = require('express')
const router = express.Router()

const categoriaController = require('../controllers/categoriaController')
const verificaToken = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')

router.get('/categorias', categoriaController.listar)
router.get('/categorias/:id', categoriaController.buscarPorId)

router.post('/categorias', verificaToken, isAdmin, categoriaController.cadastrar)
router.put('/categorias/:id', verificaToken, isAdmin, categoriaController.atualizar)
router.patch('/categorias/:id', verificaToken, isAdmin, categoriaController.atualizarParcial)
router.delete('/categorias/:id', verificaToken, isAdmin, categoriaController.apagar)

module.exports = router
