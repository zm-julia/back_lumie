const { Categoria } = require('../models/rel')

const categoriaController = {}

categoriaController.listar = async (req, res) => {
    try {
        const categorias = await Categoria.findAll()
        return res.status(200).json(categorias)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao listar categorias.' })
    }
}

categoriaController.buscarPorId = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id)

        if (!categoria) {
            return res.status(404).json({ erro: 'Categoria não encontrada.' })
        }

        return res.status(200).json(categoria)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao buscar categoria.' })
    }
}

categoriaController.cadastrar = async (req, res) => {
    try {
        const { nome, descricao } = req.body

        if (!nome) {
            return res.status(400).json({ erro: 'O nome da categoria é obrigatório.' })
        }

        const categoriaExistente = await Categoria.findOne({ where: { nome } })
        if (categoriaExistente) {
            return res.status(409).json({ erro: 'Já existe uma categoria com esse nome.' })
        }

        const novaCategoria = await Categoria.create({ nome, descricao })
        return res.status(201).json(novaCategoria)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao cadastrar categoria.' })
    }
}

categoriaController.atualizar = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id)
        if (!categoria) {
            return res.status(404).json({ erro: 'Categoria não encontrada.' })
        }

        const { nome, descricao } = req.body
        if (!nome) {
            return res.status(400).json({ erro: 'O nome da categoria é obrigatório.' })
        }

        await categoria.update({ nome, descricao })
        return res.status(200).json(categoria)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao atualizar categoria.' })
    }
}

categoriaController.atualizarParcial = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id)
        if (!categoria) {
            return res.status(404).json({ erro: 'Categoria não encontrada.' })
        }

        await categoria.update(req.body)
        return res.status(200).json(categoria)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao atualizar categoria.' })
    }
}

categoriaController.apagar = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id)
        if (!categoria) {
            return res.status(404).json({ erro: 'Categoria não encontrada.' })
        }

        await categoria.destroy()
        return res.status(200).json({ mensagem: 'Categoria removida com sucesso.' })

    } catch (err) {
        console.error(err)
        return res.status(400).json({ erro: 'Não é possível remover: existem produtos vinculados a essa categoria.' })
    }
}

module.exports = categoriaController
