const bcrypt = require('bcrypt')
const conn = require('./db/conn')
const { Categoria, Produto, Estoque, Usuario, Profissional, Servico, Localizacao } = require('./models/rel')

async function seed() {
    try {
        // 1. Categorias (batendo com a vitrine "Compre por categoria")
        const categorias = await Categoria.bulkCreate([
            { nome: 'Maquiagem', descricao: 'Batons, bases, paletas e muito mais' },
            { nome: 'Skincare', descricao: 'Séruns, hidratantes e cuidados com a pele' },
            { nome: 'Cabelos', descricao: 'Shampoos, óleos e finalizadores' },
            { nome: 'Body Care', descricao: 'Hidratantes e cuidados corporais' },
            { nome: 'Acessórios', descricao: 'Pincéis, esponjas e ferramentas' },
            { nome: 'Presentes', descricao: 'Kits e presentes especiais' }
        ])

        const [maquiagem, skincare, cabelos, bodyCare, acessorios, presentes] = categorias

        // 2. Produtos, cada um com seu registro de estoque
        const produtos = [
            { idCategoria: maquiagem.codCategoria, nome: 'Batom Líquido Matte', preco: 59.90, estoque: 40,
              imagem: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80' },
            { idCategoria: skincare.codCategoria, nome: 'Sérum Niacinamide 10% + Zinc 1%', preco: 89.90, estoque: 35,
              imagem: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80' },
            { idCategoria: cabelos.codCategoria, nome: 'Óleo Reflections Light', preco: 129.90, estoque: 20,
              imagem: 'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=400&q=80' },
            { idCategoria: bodyCare.codCategoria, nome: 'Hidratante Corporal', preco: 49.90, estoque: 0,
              imagem: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80' },
            { idCategoria: maquiagem.codCategoria, nome: 'Paleta de Sombras', preco: 69.90, estoque: 25,
              imagem: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80' },
            { idCategoria: acessorios.codCategoria, nome: 'Kit de Pincéis para Maquiagem', preco: 79.90, estoque: 18,
              imagem: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80' },
            { idCategoria: skincare.codCategoria, nome: 'Protetor Solar Facial FPS 60', preco: 54.90, estoque: 30,
              imagem: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400&q=80' },
            { idCategoria: presentes.codCategoria, nome: 'Kit Presente Beauty Bag', preco: 149.90, estoque: 12,
              imagem: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80' }
        ]

        for (const p of produtos) {
            const produtoCriado = await Produto.create({
                idCategoria: p.idCategoria,
                nome: p.nome,
                preco: p.preco,
                imagem_url: p.imagem,
                descricao: `${p.nome} - qualidade LUMIÉ.`
            })

            await Estoque.create({
                idProduto: produtoCriado.codProduto,
                quantidade_atual: p.estoque,
                quantidade_minima: 5
            })
        }

        // 3. Usuário administrador de teste
        const senhaCriptografada = await bcrypt.hash('admin123', 10)
        await Usuario.create({
            nome: 'Administrador',
            email: 'admin@lumie.com',
            senha: senhaCriptografada,
            telefone: '(11) 90000-0000',
            cpf: '52998224725', // CPF válido gerado só para teste
            tipo_usuario: 'ADMIN',
            cep: '01310-100',
            logradouro: 'Avenida Paulista',
            bairro: 'Bela Vista',
            localidade: 'São Paulo',
            uf: 'SP',
            numero: '1000'
        })

        // 4. Profissionais em destaque (nomes batendo com a referência), cada um com
        //    localização (pro mapa) e pelo menos um serviço (pro agendamento)
        const profissionaisData = [
            {
                nome: 'Camila Rocha', especialidade: 'Maquiadora', preco_base: 150,
                foto_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80',
                endereco: { cep: '01310-100', logradouro: 'Avenida Paulista', bairro: 'Bela Vista', localidade: 'São Paulo', uf: 'SP', numero: '1500', latitude: -23.5613, longitude: -46.6565 },
                servico: { nome: 'Maquiagem para eventos', preco: 150, duracao_minutos: 90 }
            },
            {
                nome: 'Bianca Lima', especialidade: 'Cabeleireira', preco_base: 120,
                foto_url: 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?w=300&q=80',
                endereco: { cep: '04538-133', logradouro: 'Avenida Brigadeiro Faria Lima', bairro: 'Itaim Bibi', localidade: 'São Paulo', uf: 'SP', numero: '2200', latitude: -23.5875, longitude: -46.6883 },
                servico: { nome: 'Corte e escova', preco: 120, duracao_minutos: 60 }
            },
            {
                nome: 'Juliana Mendes', especialidade: 'Dermatologista', preco_base: 200,
                foto_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&q=80',
                endereco: { cep: '05407-002', logradouro: 'Rua Oscar Freire', bairro: 'Jardins', localidade: 'São Paulo', uf: 'SP', numero: '800', latitude: -23.5629, longitude: -46.6708 },
                servico: { nome: 'Consulta dermatológica', preco: 200, duracao_minutos: 45 }
            },
            {
                nome: 'Lívia Castro', especialidade: 'Especialista em Penteados', preco_base: 180,
                foto_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&q=80',
                endereco: { cep: '01452-000', logradouro: 'Avenida Rebouças', bairro: 'Pinheiros', localidade: 'São Paulo', uf: 'SP', numero: '300', latitude: -23.5670, longitude: -46.6790 },
                servico: { nome: 'Penteado para noivas', preco: 180, duracao_minutos: 120 }
            }
        ]

        for (const p of profissionaisData) {
            const profissionalCriado = await Profissional.create({
                nome: p.nome,
                especialidade: p.especialidade,
                foto_url: p.foto_url,
                preco_base: p.preco_base,
                bio: `${p.nome} é ${p.especialidade.toLowerCase()} parceira LUMIÉ.`
            })

            await Localizacao.create({
                idProfissional: profissionalCriado.codProfissional,
                ...p.endereco
            })

            await Servico.create({
                idProfissional: profissionalCriado.codProfissional,
                ...p.servico
            })
        }

        console.log('--------------------------------------------------')
        console.log('Seed executado com sucesso!')
        console.log('Login admin -> email: admin@lumie.com | senha: admin123')
        console.log('--------------------------------------------------')

    } catch (err) {
        console.error('Erro ao rodar o seed:', err)
    } finally {
        await conn.close()
    }
}

seed()
