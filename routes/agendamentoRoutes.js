const express = require('express')
const router = express.Router()

const agendamentoController = require('../controllers/agendamentoController')
const verificaToken = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')

// Todas as rotas de agendamento são privadas (exigem login)
// IMPORTANTE: /agendamentos/meus-agendamentos precisa vir ANTES de rotas com :id
router.post('/agendamentos', verificaToken, agendamentoController.criar)
router.get('/agendamentos/meus-agendamentos', verificaToken, agendamentoController.meusAgendamentos)
router.get('/agendamentos', verificaToken, isAdmin, agendamentoController.listar)
router.patch('/agendamentos/:id', verificaToken, agendamentoController.atualizarStatus)

module.exports = router
