const { fn, col } = require('sequelize')
const { ItemPedido, Produto, Categoria, Estoque } = require('../models/rel')

const relatorioController = {}

relatorioController.vendasPorCategoria = async (req, res) => {
    try {
        const resultado = await ItemPedido.findAll({
            attributes: [
                [fn('SUM', col('valorTotalItem')), 'totalVendido'],
                [fn('SUM', col('quantidade')), 'totalUnidades']
            ],
            include: [{
                model: Produto,
                as: 'produtoItem',
                attributes: [],
                include: [{
                    model: Categoria,
                    as: 'categoriaProduto',
                    attributes: ['nome']
                }]
            }],
            group: ['produtoItem.categoriaProduto.codCategoria', 'produtoItem.categoriaProduto.nome'],
            raw: true
        })

        const relatorio = resultado.map((linha) => ({
            categoria: linha['produtoItem.categoriaProduto.nome'],
            totalVendido: Number(linha.totalVendido),
            totalUnidades: Number(linha.totalUnidades)
        }))

        return res.status(200).json(relatorio)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao gerar relatório de vendas.' })
    }
}


relatorioController.situacaoEstoque = async (req, res) => {
    try {
        const estoques = await Estoque.findAll({
            include: [{ model: Produto, as: 'produtoEstoque', attributes: ['nome'] }],
            order: [['quantidade_atual', 'ASC']]
        })

        const relatorio = estoques.map((e) => ({
            produto: e.produtoEstoque.nome,
            quantidade_atual: e.quantidade_atual,
            quantidade_minima: e.quantidade_minima
        }))

        return res.status(200).json(relatorio)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao gerar relatório de estoque.' })
    }
}

module.exports = relatorioController
