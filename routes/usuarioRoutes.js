const express = require('express')
const router = express.Router()

const usuarioController = require('../controllers/usuarioController')
const verificaToken = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')

router.post('/login', usuarioController.login)
router.post('/usuarios', usuarioController.cadastrar)

router.get('/usuarios/perfil', verificaToken, usuarioController.perfil)
router.get('/usuarios', verificaToken, isAdmin, usuarioController.listar)
router.put('/usuarios/:id', verificaToken, usuarioController.atualizar)
router.patch('/usuarios/:id', verificaToken, usuarioController.atualizarParcial)
router.delete('/usuarios/:id', verificaToken, isAdmin, usuarioController.apagar)

module.exports = router
