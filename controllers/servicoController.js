const { Servico, Profissional } = require('../models/rel')

const servicoController = {}

// GET /servicos -> Listagem geral, com filtro opcional por profissional (rota pública)
// Ex: GET /servicos?idProfissional=3
servicoController.listar = async (req, res) => {
    try {
        const { idProfissional } = req.query
        const filtro = idProfissional ? { idProfissional } : {}

        const servicos = await Servico.findAll({
            where: filtro,
            include: [{ model: Profissional, as: 'profissionalServico' }]
        })

        return res.status(200).json(servicos)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao listar serviços.' })
    }
}

// GET /servicos/:id -> Consulta por código (rota pública)
servicoController.buscarPorId = async (req, res) => {
    try {
        const servico = await Servico.findByPk(req.params.id, {
            include: [{ model: Profissional, as: 'profissionalServico' }]
        })

        if (!servico) {
            return res.status(404).json({ erro: 'Serviço não encontrado.' })
        }

        return res.status(200).json(servico)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao buscar serviço.' })
    }
}

// POST /servicos -> Cadastro (rota privada, ADMIN)
servicoController.cadastrar = async (req, res) => {
    try {
        const { idProfissional, nome, descricao, preco, duracao_minutos } = req.body

        if (!idProfissional || !nome || !preco) {
            return res.status(400).json({ erro: 'Preencha profissional, nome e preço do serviço.' })
        }

        // Verifica previamente se o profissional informado existe
        const profissional = await Profissional.findByPk(idProfissional)
        if (!profissional) {
            return res.status(404).json({ erro: 'O profissional informado não existe.' })
        }

        const novoServico = await Servico.create({ idProfissional, nome, descricao, preco, duracao_minutos })
        return res.status(201).json(novoServico)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao cadastrar serviço.' })
    }
}

// PUT /servicos/:id -> Atualização completa (rota privada, ADMIN)
servicoController.atualizar = async (req, res) => {
    try {
        const servico = await Servico.findByPk(req.params.id)
        if (!servico) {
            return res.status(404).json({ erro: 'Serviço não encontrado.' })
        }

        const { nome, descricao, preco, duracao_minutos } = req.body
        if (!nome || !preco) {
            return res.status(400).json({ erro: 'Preencha nome e preço do serviço.' })
        }

        await servico.update({ nome, descricao, preco, duracao_minutos })
        return res.status(200).json(servico)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao atualizar serviço.' })
    }
}

// PATCH /servicos/:id -> Atualização parcial (rota privada, ADMIN)
servicoController.atualizarParcial = async (req, res) => {
    try {
        const servico = await Servico.findByPk(req.params.id)
        if (!servico) {
            return res.status(404).json({ erro: 'Serviço não encontrado.' })
        }

        await servico.update(req.body)
        return res.status(200).json(servico)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao atualizar serviço.' })
    }
}

// DELETE /servicos/:id -> Apaga serviço (rota privada, ADMIN)
servicoController.apagar = async (req, res) => {
    try {
        const servico = await Servico.findByPk(req.params.id)
        if (!servico) {
            return res.status(404).json({ erro: 'Serviço não encontrado.' })
        }

        await servico.destroy()
        return res.status(200).json({ mensagem: 'Serviço removido com sucesso.' })

    } catch (err) {
        console.error(err)
        return res.status(400).json({ erro: 'Não é possível remover: esse serviço já possui agendamentos.' })
    }
}

module.exports = servicoController
