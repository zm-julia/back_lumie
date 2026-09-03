const db = require('../db/conn')
const { Pedido, ItemPedido, Produto, Estoque, Entrega, Usuario } = require('../models/rel')

const pedidoController = {}

const VALOR_FRETE = 10.0

pedidoController.criar = async (req, res) => {
    
    const t = await db.transaction()

    try {
        const { itens, enderecoEntrega } = req.body
        const idUsuario = req.usuarioLogado.codUsuario

        if (!itens || !Array.isArray(itens) || itens.length === 0) {
            await t.rollback()
            return res.status(400).json({ erro: 'O carrinho está vazio.' })
        }

        let valorSubtotal = 0
        const itensValidados = []

      
        for (const item of itens) {
            const produto = await Produto.findByPk(item.idProduto, { transaction: t })

            if (!produto) {
                await t.rollback()
                return res.status(404).json({ erro: `Produto ${item.idProduto} não encontrado.` })
            }

            const estoque = await Estoque.findOne({ where: { idProduto: item.idProduto }, transaction: t })

            if (!estoque || estoque.quantidade_atual < item.quantidade) {
                await t.rollback()
                return res.status(400).json({ erro: `Estoque insuficiente para o produto "${produto.nome}".` })
            }

            const precoUnitario = produto.preco
            const valorTotalItem = precoUnitario * item.quantidade
            valorSubtotal += Number(valorTotalItem)

            itensValidados.push({ produto, estoque, quantidade: item.quantidade, precoUnitario, valorTotalItem })
        }

        const valorTotal = valorSubtotal + VALOR_FRETE

        const novoPedido = await Pedido.create({
            idUsuario,
            status: 'PENDENTE_PAGAMENTO',
            valorSubtotal,
            valorFrete: VALOR_FRETE,
            valorTotal
        }, { transaction: t })

        for (const item of itensValidados) {
            await ItemPedido.create({
                idPedido: novoPedido.codPedido,
                idProduto: item.produto.codProduto,
                quantidade: item.quantidade,
                precoUnitario: item.precoUnitario,
                valorTotalItem: item.valorTotalItem
            }, { transaction: t })

            item.estoque.quantidade_atual -= item.quantidade
            await item.estoque.save({ transaction: t })
        }

     
        let endereco = enderecoEntrega
        if (!endereco) {
            const usuario = await Usuario.findByPk(idUsuario, { transaction: t })
            endereco = {
                cep: usuario.cep,
                logradouro: usuario.logradouro,
                complemento: usuario.complemento,
                bairro: usuario.bairro,
                localidade: usuario.localidade,
                uf: usuario.uf,
                numero: usuario.numero
            }
        }

        await Entrega.create({
            idPedido: novoPedido.codPedido,
            ...endereco,
            statusEntrega: 'EM_TRANSITO'
        }, { transaction: t })

        await t.commit()

        const pedidoCompleto = await Pedido.findByPk(novoPedido.codPedido, {
            include: [
                { model: ItemPedido, as: 'itensPedido', include: [{ model: Produto, as: 'produtoItem' }] },
                { model: Entrega, as: 'entregaPedido' }
            ]
        })

        return res.status(201).json(pedidoCompleto)

    } catch (err) {
        await t.rollback()
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao finalizar o pedido.' })
    }
}

pedidoController.meusPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            where: { idUsuario: req.usuarioLogado.codUsuario },
            include: [
                { model: ItemPedido, as: 'itensPedido', include: [{ model: Produto, as: 'produtoItem' }] },
                { model: Entrega, as: 'entregaPedido' }
            ],
            order: [['dataPedido', 'DESC']]
        })

        return res.status(200).json(pedidos)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao buscar histórico de pedidos.' })
    }
}

pedidoController.listar = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [
                { model: ItemPedido, as: 'itensPedido', include: [{ model: Produto, as: 'produtoItem' }] },
                { model: Entrega, as: 'entregaPedido' },
                { model: Usuario, as: 'usuarioPedido', attributes: { exclude: ['senha'] } }
            ],
            order: [['dataPedido', 'DESC']]
        })

        return res.status(200).json(pedidos)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao listar pedidos.' })
    }
}

pedidoController.buscarPorId = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id, {
            include: [
                { model: ItemPedido, as: 'itensPedido', include: [{ model: Produto, as: 'produtoItem' }] },
                { model: Entrega, as: 'entregaPedido' }
            ]
        })

        if (!pedido) {
            return res.status(404).json({ erro: 'Pedido não encontrado.' })
        }

        if (pedido.idUsuario !== req.usuarioLogado.codUsuario && req.usuarioLogado.tipo_usuario !== 'ADMIN') {
            return res.status(403).json({ erro: 'Você não tem permissão para ver esse pedido.' })
        }

        return res.status(200).json(pedido)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao buscar pedido.' })
    }
}

pedidoController.atualizarStatus = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id, {
            include: [{ model: Entrega, as: 'entregaPedido' }]
        })

        if (!pedido) {
            return res.status(404).json({ erro: 'Pedido não encontrado.' })
        }

        const { status, statusEntrega, codigoRastreio } = req.body

        if (status) {
            await pedido.update({ status })
        }

        if (pedido.entregaPedido && (statusEntrega || codigoRastreio)) {
            await pedido.entregaPedido.update({
                ...(statusEntrega && { statusEntrega }),
                ...(codigoRastreio && { codigoRastreio })
            })
        }

        return res.status(200).json({ mensagem: 'Pedido atualizado com sucesso.' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao atualizar pedido.' })
    }
}

module.exports = pedidoController
