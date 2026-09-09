const express = require('express')
const router = express.Router()

const servicoController = require('../controllers/servicoController')
const verificaToken = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')

// Rotas públicas
router.get('/servicos', servicoController.listar)
router.get('/servicos/:id', servicoController.buscarPorId)

// Rotas privadas (ADMIN)
router.post('/servicos', verificaToken, isAdmin, servicoController.cadastrar)
router.put('/servicos/:id', verificaToken, isAdmin, servicoController.atualizar)
router.patch('/servicos/:id', verificaToken, isAdmin, servicoController.atualizarParcial)
router.delete('/servicos/:id', verificaToken, isAdmin, servicoController.apagar)

module.exports = router
