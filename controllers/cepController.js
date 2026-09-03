const consultaCep = require('../utils/consultaCep')

const cepController = {}

cepController.buscar = async (req, res) => {
    try {
        const endereco = await consultaCep(req.params.cep)

        if (!endereco) {
            return res.status(404).json({ erro: 'CEP não encontrado.' })
        }

        return res.status(200).json(endereco)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ erro: 'Erro ao consultar o CEP.' })
    }
}

module.exports = cepController
