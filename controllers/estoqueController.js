const { Estoque, Produto } = require('../models/rel')

const estoqueController = {}

estoqueController.listar = async (req, res) => {
    try {
        const estoques = await Estoque.findAll({
            include: [{ model: Produto, as: 'produtoEstoque' }]
        })
        return res.status(200).json(estoques)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao listar estoque.' })
    }
}

estoqueController.buscarPorId = async (req, res) => {
    try {
        const estoque = await Estoque.findByPk(req.params.id, {
            include: [{ model: Produto, as: 'produtoEstoque' }]
        })

        if (!estoque) {
            return res.status(404).json({ erro: 'Registro de estoque não encontrado.' })
        }

        return res.status(200).json(estoque)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao buscar estoque.' })
    }
}

estoqueController.movimentar = async (req, res) => {
    try {
        const { idProduto, quantidade, tipoMovimento } = req.body

        if (!idProduto || !quantidade || !tipoMovimento) {
            return res.status(400).json({ erro: 'Informe idProduto, quantidade e tipoMovimento.' })
        }

        const produto = await Produto.findByPk(idProduto)
        if (!produto) {
            return res.status(404).json({ erro: 'Produto não encontrado.' })
        }

        let estoque = await Estoque.findOne({ where: { idProduto } })

        if (!estoque) {
            estoque = await Estoque.create({ idProduto, quantidade_atual: 0, quantidade_minima: 0 })
        }

        if (tipoMovimento === 'ENTRADA') {
            estoque.quantidade_atual += Number(quantidade)
        } else if (tipoMovimento === 'SAIDA') {
            if (estoque.quantidade_atual < Number(quantidade)) {
                return res.status(400).json({ erro: 'Quantidade em estoque insuficiente para essa saída.' })
            }
            estoque.quantidade_atual -= Number(quantidade)
        } else {
            return res.status(400).json({ erro: "tipoMovimento deve ser 'ENTRADA' ou 'SAIDA'." })
        }

        await estoque.save()
        return res.status(201).json(estoque)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao movimentar estoque.' })
    }
}

estoqueController.atualizar = async (req, res) => {
    try {
        const estoque = await Estoque.findByPk(req.params.id)
        if (!estoque) {
            return res.status(404).json({ erro: 'Registro de estoque não encontrado.' })
        }

        const { quantidade_atual, quantidade_minima } = req.body

        await estoque.update({ quantidade_atual, quantidade_minima })
        return res.status(200).json(estoque)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao atualizar estoque.' })
    }
}

module.exports = estoqueController
