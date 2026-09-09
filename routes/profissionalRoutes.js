const express = require('express')
const router = express.Router()

const profissionalController = require('../controllers/profissionalController')
const verificaToken = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')

// Rotas públicas
router.get('/profissionais', profissionalController.listar)
router.get('/profissionais/:id', profissionalController.buscarPorId)

// Rotas privadas (ADMIN)
router.post('/profissionais', verificaToken, isAdmin, profissionalController.cadastrar)
router.put('/profissionais/:id', verificaToken, isAdmin, profissionalController.atualizar)
router.patch('/profissionais/:id', verificaToken, isAdmin, profissionalController.atualizarParcial)
router.delete('/profissionais/:id', verificaToken, isAdmin, profissionalController.apagar)

module.exports = router
