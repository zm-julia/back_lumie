
async function consultaCep(cepRecebido) {
    const cep = String(cepRecebido).replace(/[^\d]/g, '')

    if (cep.length !== 8) {
        return null
    }

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const dados = await resposta.json()

        if (dados.erro) {
            return null
        }

        return dados
    } catch (err) {
        console.error('Erro ao consultar o ViaCEP:', err)
        return null
    }
}

module.exports = consultaCep
