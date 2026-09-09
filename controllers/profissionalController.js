const { Profissional, Localizacao, Servico, Avaliacao } = require('../models/rel')

const profissionalController = {}

// Calcula a média de notas (1 a 5) e a quantidade de avaliações de um profissional
function calcularMedia(avaliacoes) {
    if (!avaliacoes || avaliacoes.length === 0) {
        return { media: null, quantidade: 0 }
    }

    const soma = avaliacoes.reduce((total, av) => total + av.nota, 0)
    return {
        media: Number((soma / avaliacoes.length).toFixed(1)),
        quantidade: avaliacoes.length
    }
}

// GET /profissionais -> Listagem geral (rota pública), com localização e avaliação média
profissionalController.listar = async (req, res) => {
    try {
        const profissionais = await Profissional.findAll({
            where: { ativo: true },
            include: [
                { model: Localizacao, as: 'localizacaoProfissional' },
                { model: Avaliacao, as: 'avaliacoesProfissional', attributes: ['nota'] }
            ]
        })

        // Adiciona os campos "avaliacaoMedia" e "totalAvaliacoes" na resposta
        const listaComMedia = profissionais.map((p) => {
            const { media, quantidade } = calcularMedia(p.avaliacoesProfissional)
            const profissionalJson = p.toJSON()
            profissionalJson.avaliacaoMedia = media
            profissionalJson.totalAvaliacoes = quantidade
            delete profissionalJson.avaliacoesProfissional
            return profissionalJson
        })

        return res.status(200).json(listaComMedia)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao listar profissionais.' })
    }
}

// GET /profissionais/:id -> Consulta por código (rota pública)
profissionalController.buscarPorId = async (req, res) => {
    try {
        const profissional = await Profissional.findByPk(req.params.id, {
            include: [
                { model: Localizacao, as: 'localizacaoProfissional' },
                { model: Servico, as: 'servicosProfissional' },
                { model: Avaliacao, as: 'avaliacoesProfissional' }
            ]
        })

        if (!profissional) {
            return res.status(404).json({ erro: 'Profissional não encontrado.' })
        }

        const { media, quantidade } = calcularMedia(profissional.avaliacoesProfissional)
        const profissionalJson = profissional.toJSON()
        profissionalJson.avaliacaoMedia = media
        profissionalJson.totalAvaliacoes = quantidade

        return res.status(200).json(profissionalJson)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao buscar profissional.' })
    }
}

// POST /profissionais -> Cadastro (rota privada, ADMIN), já cria a localização junto
profissionalController.cadastrar = async (req, res) => {
    try {
        const { nome, especialidade, bio, foto_url, preco_base,
                cep, logradouro, complemento, bairro, localidade, uf, numero, latitude, longitude } = req.body

        if (!nome || !especialidade || !cep || !logradouro || !bairro || !localidade || !uf || !numero) {
            return res.status(400).json({ erro: 'Preencha nome, especialidade e o endereço completo.' })
        }

        const novoProfissional = await Profissional.create({ nome, especialidade, bio, foto_url, preco_base })

        await Localizacao.create({
            idProfissional: novoProfissional.codProfissional,
            cep, logradouro, complemento, bairro, localidade, uf, numero, latitude, longitude
        })

        const profissionalCompleto = await Profissional.findByPk(novoProfissional.codProfissional, {
            include: [{ model: Localizacao, as: 'localizacaoProfissional' }]
        })

        return res.status(201).json(profissionalCompleto)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao cadastrar profissional.' })
    }
}

// PUT /profissionais/:id -> Atualização completa (rota privada, ADMIN)
profissionalController.atualizar = async (req, res) => {
    try {
        const profissional = await Profissional.findByPk(req.params.id)
        if (!profissional) {
            return res.status(404).json({ erro: 'Profissional não encontrado.' })
        }

        const { nome, especialidade, bio, foto_url, preco_base, ativo,
                cep, logradouro, complemento, bairro, localidade, uf, numero, latitude, longitude } = req.body

        if (!nome || !especialidade) {
            return res.status(400).json({ erro: 'Preencha nome e especialidade.' })
        }

        await profissional.update({ nome, especialidade, bio, foto_url, preco_base, ativo })

        // Se algum dado de endereço veio no corpo, atualiza a localização vinculada também
        if (cep || logradouro || bairro || localidade || uf || numero || latitude || longitude) {
            const localizacao = await Localizacao.findOne({ where: { idProfissional: profissional.codProfissional } })
            if (localizacao) {
                await localizacao.update({ cep, logradouro, complemento, bairro, localidade, uf, numero, latitude, longitude })
            }
        }

        const profissionalAtualizado = await Profissional.findByPk(profissional.codProfissional, {
            include: [{ model: Localizacao, as: 'localizacaoProfissional' }]
        })

        return res.status(200).json(profissionalAtualizado)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao atualizar profissional.' })
    }
}

// PATCH /profissionais/:id -> Atualização parcial (rota privada, ADMIN)
profissionalController.atualizarParcial = async (req, res) => {
    try {
        const profissional = await Profissional.findByPk(req.params.id)
        if (!profissional) {
            return res.status(404).json({ erro: 'Profissional não encontrado.' })
        }

        await profissional.update(req.body)
        return res.status(200).json(profissional)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao atualizar profissional.' })
    }
}

// DELETE /profissionais/:id -> Apaga profissional (rota privada, ADMIN)
profissionalController.apagar = async (req, res) => {
    try {
        const profissional = await Profissional.findByPk(req.params.id)
        if (!profissional) {
            return res.status(404).json({ erro: 'Profissional não encontrado.' })
        }

        await profissional.destroy()
        return res.status(200).json({ mensagem: 'Profissional removido com sucesso.' })

    } catch (err) {
        console.error(err)
        return res.status(400).json({ erro: 'Não é possível remover: esse profissional possui serviços com agendamentos.' })
    }
}

module.exports = profissionalController
