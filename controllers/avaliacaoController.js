const { Avaliacao, Agendamento, Profissional, Usuario } = require('../models/rel')

const avaliacaoController = {}

// POST /avaliacoes -> Cliente avalia um agendamento já concluído (rota privada)
avaliacaoController.criar = async (req, res) => {
    try {
        const { idAgendamento, nota, comentario } = req.body
        const idUsuario = req.usuarioLogado.codUsuario

        if (!idAgendamento || !nota) {
            return res.status(400).json({ erro: 'Informe o agendamento e a nota.' })
        }

        if (nota < 1 || nota > 5) {
            return res.status(400).json({ erro: 'A nota deve ser entre 1 e 5.' })
        }

        // Verifica previamente se o agendamento existe e é desse cliente
        const agendamento = await Agendamento.findByPk(idAgendamento, {
            include: [{ model: Avaliacao, as: 'avaliacaoAgendamento' }]
        })

        if (!agendamento) {
            return res.status(404).json({ erro: 'Agendamento não encontrado.' })
        }

        if (agendamento.idUsuario !== idUsuario) {
            return res.status(403).json({ erro: 'Você só pode avaliar os seus próprios agendamentos.' })
        }

        if (agendamento.status !== 'CONCLUIDO') {
            return res.status(400).json({ erro: 'Só é possível avaliar agendamentos já concluídos.' })
        }

        // Verifica previamente se esse agendamento já foi avaliado
        if (agendamento.avaliacaoAgendamento) {
            return res.status(409).json({ erro: 'Esse agendamento já foi avaliado.' })
        }

        const servico = await agendamento.getServicoAgendamento()

        const novaAvaliacao = await Avaliacao.create({
            idUsuario,
            idProfissional: servico.idProfissional,
            idAgendamento,
            nota,
            comentario
        })

        return res.status(201).json(novaAvaliacao)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao registrar avaliação.' })
    }
}

// GET /avaliacoes?idProfissional=3 -> Lista as avaliações de um profissional (rota pública)
avaliacaoController.listar = async (req, res) => {
    try {
        const { idProfissional } = req.query
        const filtro = idProfissional ? { idProfissional } : {}

        const avaliacoes = await Avaliacao.findAll({
            where: filtro,
            include: [{ model: Usuario, as: 'usuarioAvaliacao', attributes: ['nome'] }],
            order: [['dataAvaliacao', 'DESC']]
        })

        return res.status(200).json(avaliacoes)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao listar avaliações.' })
    }
}

module.exports = avaliacaoController
