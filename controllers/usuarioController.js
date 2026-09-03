const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { Usuario } = require('../models/rel')
const validaCpf = require('../utils/validaCpf')

const usuarioController = {}

usuarioController.cadastrar = async (req, res) => {
    try {
        const { nome, email, senha, telefone, cpf, identidade,
                cep, logradouro, complemento, bairro, localidade, uf, numero } = req.body

        if (!nome || !email || !senha || !telefone || !cpf ||
            !cep || !logradouro || !bairro || !localidade || !uf || !numero) {
            return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios, inclusive o endereço.' })
        }

        if (!validaCpf(cpf)) {
            return res.status(400).json({ erro: 'CPF inválido.' })
        }

        const usuarioExistente = await Usuario.findOne({
            where: {
                [Op.or]: [{ email }, { cpf }]
            }
        })

        if (usuarioExistente) {
            return res.status(409).json({ erro: 'Já existe um usuário cadastrado com esse e-mail ou CPF.' })
        }

        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds)

        const novoUsuario = await Usuario.create({
            nome, email, senha: senhaCriptografada, telefone, cpf, identidade,
            cep, logradouro, complemento, bairro, localidade, uf, numero,
            tipo_usuario: 'CLIENTE'
        })

        const { senha: _senhaOculta, ...usuarioSemSenha } = novoUsuario.toJSON()

        return res.status(201).json(usuarioSemSenha)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao cadastrar usuário.' })
    }
}

usuarioController.login = async (req, res) => {
    try {
        const { email, senha } = req.body

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Informe e-mail e senha.' })
        }

        const usuario = await Usuario.findOne({ where: { email } })

        if (!usuario) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' })
        }

        const senhaConfere = await bcrypt.compare(senha, usuario.senha)

        if (!senhaConfere) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' })
        }

        const token = jwt.sign(
            {
                codUsuario: usuario.codUsuario,
                email: usuario.email,
                tipo_usuario: usuario.tipo_usuario
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        return res.status(200).json({
            token,
            usuario: {
                codUsuario: usuario.codUsuario,
                nome: usuario.nome,
                email: usuario.email,
                tipo_usuario: usuario.tipo_usuario
            }
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao realizar login.' })
    }
}

usuarioController.perfil = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.usuarioLogado.codUsuario, {
            attributes: { exclude: ['senha'] }
        })

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' })
        }

        return res.status(200).json(usuario)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao buscar perfil.' })
    }
}

usuarioController.listar = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({ attributes: { exclude: ['senha'] } })
        return res.status(200).json(usuarios)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao listar usuários.' })
    }
}

usuarioController.atualizar = async (req, res) => {
    try {
        const { id } = req.params

        const usuario = await Usuario.findByPk(id)
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' })
        }

        if (req.usuarioLogado.codUsuario !== Number(id) && req.usuarioLogado.tipo_usuario !== 'ADMIN') {
            return res.status(403).json({ erro: 'Você não tem permissão para alterar esse usuário.' })
        }

        const { nome, email, senha, telefone, cpf, identidade,
                cep, logradouro, complemento, bairro, localidade, uf, numero } = req.body

        if (!nome || !email || !telefone || !cpf ||
            !cep || !logradouro || !bairro || !localidade || !uf || !numero) {
            return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' })
        }

        if (!validaCpf(cpf)) {
            return res.status(400).json({ erro: 'CPF inválido.' })
        }

        const dadosAtualizados = {
            nome, email, telefone, cpf, identidade,
            cep, logradouro, complemento, bairro, localidade, uf, numero
        }

        if (senha) {
            const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10
            dadosAtualizados.senha = await bcrypt.hash(senha, saltRounds)
        }

        await usuario.update(dadosAtualizados)

        const { senha: _s, ...usuarioSemSenha } = usuario.toJSON()
        return res.status(200).json(usuarioSemSenha)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao atualizar usuário.' })
    }
}

usuarioController.atualizarParcial = async (req, res) => {
    try {
        const { id } = req.params

        const usuario = await Usuario.findByPk(id)
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' })
        }

        if (req.usuarioLogado.codUsuario !== Number(id) && req.usuarioLogado.tipo_usuario !== 'ADMIN') {
            return res.status(403).json({ erro: 'Você não tem permissão para alterar esse usuário.' })
        }

        const camposPermitidos = ['nome', 'email', 'telefone', 'identidade',
            'cep', 'logradouro', 'complemento', 'bairro', 'localidade', 'uf', 'numero']
        const dadosParaAtualizar = {}

        camposPermitidos.forEach((campo) => {
            if (req.body[campo] !== undefined) {
                dadosParaAtualizar[campo] = req.body[campo]
            }
        })

        if (req.body.cpf) {
            if (!validaCpf(req.body.cpf)) {
                return res.status(400).json({ erro: 'CPF inválido.' })
            }
            dadosParaAtualizar.cpf = req.body.cpf
        }

        if (req.body.senha) {
            const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10
            dadosParaAtualizar.senha = await bcrypt.hash(req.body.senha, saltRounds)
        }

        await usuario.update(dadosParaAtualizar)

        const { senha: _s, ...usuarioSemSenha } = usuario.toJSON()
        return res.status(200).json(usuarioSemSenha)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao atualizar usuário.' })
    }
}

usuarioController.apagar = async (req, res) => {
    try {
        const { id } = req.params

        const usuario = await Usuario.findByPk(id)
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' })
        }

        await usuario.destroy()
        return res.status(200).json({ mensagem: 'Usuário removido com sucesso.' })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao remover usuário.' })
    }
}

module.exports = usuarioController
