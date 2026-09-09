const { Op } = require('sequelize')
const { Agendamento, Servico, Profissional, Usuario, Avaliacao } = require('../models/rel')

const agendamentoController = {}

// POST /agendamentos -> Cliente marca um horário (rota privada)
agendamentoController.criar = async (req, res) => {
    try {
        const { idServico, dataHora, observacoes } = req.body
        const idUsuario = req.usuarioLogado.codUsuario

        if (!idServico || !dataHora) {
            return res.status(400).json({ erro: 'Informe o serviço e a data/hora desejada.' })
        }

        // Verifica previamente se o serviço existe
        const servico = await Servico.findByPk(idServico)
        if (!servico) {
            return res.status(404).json({ erro: 'Serviço não encontrado.' })
        }

        // Não deixa marcar um horário que já está reservado pro mesmo serviço
        const conflito = await Agendamento.findOne({
            where: {
                idServico,
                dataHora,
                status: { [Op.in]: ['SOLICITADO', 'CONFIRMADO'] }
            }
        })

        if (conflito) {
            return res.status(409).json({ erro: 'Esse horário já está reservado. Escolha outro.' })
        }

        const novoAgendamento = await Agendamento.create({
            idUsuario,
            idServico,
            dataHora,
            observacoes,
            status: 'SOLICITADO'
        })

        const agendamentoCompleto = await Agendamento.findByPk(novoAgendamento.codAgendamento, {
            include: [{ model: Servico, as: 'servicoAgendamento', include: [{ model: Profissional, as: 'profissionalServico' }] }]
        })

        return res.status(201).json(agendamentoCompleto)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao criar agendamento.' })
    }
}

// GET /agendamentos/meus-agendamentos -> Histórico do cliente logado (rota privada)
agendamentoController.meusAgendamentos = async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll({
            where: { idUsuario: req.usuarioLogado.codUsuario },
            include: [
                { model: Servico, as: 'servicoAgendamento', include: [{ model: Profissional, as: 'profissionalServico' }] },
                { model: Avaliacao, as: 'avaliacaoAgendamento' }
            ],
            order: [['dataHora', 'DESC']]
        })

        return res.status(200).json(agendamentos)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao buscar agendamentos.' })
    }
}

// GET /agendamentos -> Listagem geral (rota privada, ADMIN)
agendamentoController.listar = async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll({
            include: [
                { model: Servico, as: 'servicoAgendamento', include: [{ model: Profissional, as: 'profissionalServico' }] },
                { model: Usuario, as: 'usuarioAgendamento', attributes: { exclude: ['senha'] } }
            ],
            order: [['dataHora', 'DESC']]
        })

        return res.status(200).json(agendamentos)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao listar agendamentos.' })
    }
}

// PATCH /agendamentos/:id -> Atualiza o status (rota privada)
// ADMIN pode mudar pra qualquer status (confirmar, concluir, cancelar).
// O próprio cliente só pode CANCELAR o seu agendamento.
agendamentoController.atualizarStatus = async (req, res) => {
    try {
        const agendamento = await Agendamento.findByPk(req.params.id)
        if (!agendamento) {
            return res.status(404).json({ erro: 'Agendamento não encontrado.' })
        }

        const { status } = req.body
        const statusValidos = ['SOLICITADO', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO']

        if (!statusValidos.includes(status)) {
            return res.status(400).json({ erro: 'Status inválido.' })
        }

        const ehDono = agendamento.idUsuario === req.usuarioLogado.codUsuario
        const ehAdmin = req.usuarioLogado.tipo_usuario === 'ADMIN'

        if (!ehAdmin && !(ehDono && status === 'CANCELADO')) {
            return res.status(403).json({ erro: 'Você só pode cancelar os seus próprios agendamentos.' })
        }

        await agendamento.update({ status })
        return res.status(200).json(agendamento)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao atualizar agendamento.' })
    }
}

module.exports = agendamentoController
