const jwt = require('jsonwebtoken')


function verificaToken(req, res, next) {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        return res.status(401).json({ erro: 'Token não informado. Faça login novamente.' })
    }

    const partes = authHeader.split(' ')

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
        return res.status(401).json({ erro: 'Token mal formatado.' })
    }

    const token = partes[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ erro: 'Token inválido ou expirado.' })
        }

        req.usuarioLogado = {
            codUsuario: decoded.codUsuario,
            email: decoded.email,
            tipo_usuario: decoded.tipo_usuario
        }

        next()
    })
}

module.exports = verificaToken
