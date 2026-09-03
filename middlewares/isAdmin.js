
function isAdmin(req, res, next) {
    if (!req.usuarioLogado || req.usuarioLogado.tipo_usuario !== 'ADMIN') {
        return res.status(403).json({ erro: 'Acesso restrito ao administrador.' })
    }

    next()
}

module.exports = isAdmin
