const { Op } = require('sequelize')
const { Produto, Categoria, Estoque } = require('../models/rel')

const produtoController = {}

produtoController.listar = async (req, res) => {
    try {
        const produtos = await Produto.findAll({
            where: { ativo: true },
            include: [
                { model: Categoria, as: 'categoriaProduto' },
                { model: Estoque, as: 'estoqueProduto' }
            ]
        })

        return res.status(200).json(produtos)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao listar produtos.' })
    }
}

produtoController.buscarPorId = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id, {
            include: [
                { model: Categoria, as: 'categoriaProduto' },
                { model: Estoque, as: 'estoqueProduto' }
            ]
        })

        if (!produto) {
            return res.status(404).json({ erro: 'Produto não encontrado.' })
        }

        return res.status(200).json(produto)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao buscar produto.' })
    }
}

produtoController.buscarPorNome = async (req, res) => {
    try {
        const { nome } = req.query

        if (!nome) {
            return res.status(400).json({ erro: 'Informe um nome para a busca.' })
        }

        const produtos = await Produto.findAll({
            where: {
                nome: { [Op.like]: `%${nome}%` },
                ativo: true
            },
            include: [
                { model: Categoria, as: 'categoriaProduto' },
                { model: Estoque, as: 'estoqueProduto' }
            ]
        })

        return res.status(200).json(produtos)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao buscar produtos.' })
    }
}

produtoController.cadastrar = async (req, res) => {
    try {
        const { idCategoria, nome, descricao, preco, imagem_url, quantidade_atual, quantidade_minima } = req.body

        if (!idCategoria || !nome || !preco) {
            return res.status(400).json({ erro: 'Preencha categoria, nome e preço do produto.' })
        }

        const categoria = await Categoria.findByPk(idCategoria)
        if (!categoria) {
            return res.status(404).json({ erro: 'A categoria informada não existe.' })
        }

        const novoProduto = await Produto.create({ idCategoria, nome, descricao, preco, imagem_url })

        await Estoque.create({
            idProduto: novoProduto.codProduto,
            quantidade_atual: quantidade_atual || 0,
            quantidade_minima: quantidade_minima || 0
        })

        const produtoCompleto = await Produto.findByPk(novoProduto.codProduto, {
            include: [
                { model: Categoria, as: 'categoriaProduto' },
                { model: Estoque, as: 'estoqueProduto' }
            ]
        })

        return res.status(201).json(produtoCompleto)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao cadastrar produto.' })
    }
}

produtoController.atualizar = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id)
        if (!produto) {
            return res.status(404).json({ erro: 'Produto não encontrado.' })
        }

        const { idCategoria, nome, descricao, preco, imagem_url, ativo } = req.body

        if (!idCategoria || !nome || !preco) {
            return res.status(400).json({ erro: 'Preencha categoria, nome e preço do produto.' })
        }

        const categoria = await Categoria.findByPk(idCategoria)
        if (!categoria) {
            return res.status(404).json({ erro: 'A categoria informada não existe.' })
        }

        await produto.update({ idCategoria, nome, descricao, preco, imagem_url, ativo })
        return res.status(200).json(produto)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao atualizar produto.' })
    }
}

produtoController.atualizarParcial = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id)
        if (!produto) {
            return res.status(404).json({ erro: 'Produto não encontrado.' })
        }

        if (req.body.idCategoria) {
            const categoria = await Categoria.findByPk(req.body.idCategoria)
            if (!categoria) {
                return res.status(404).json({ erro: 'A categoria informada não existe.' })
            }
        }

        await produto.update(req.body)
        return res.status(200).json(produto)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao atualizar produto.' })
    }
}

produtoController.apagar = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id)
        if (!produto) {
            return res.status(404).json({ erro: 'Produto não encontrado.' })
        }

        await produto.destroy()
        return res.status(200).json({ mensagem: 'Produto removido com sucesso.' })

    } catch (err) {
        console.error(err)
        return res.status(400).json({ erro: 'Não é possível remover: esse produto já possui vendas registradas.' })
    }
}

module.exports = produtoController
