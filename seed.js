const bcrypt = require('bcrypt')
const conn = require('./db/conn')
const { Categoria, Produto, Estoque, Usuario } = require('./models/rel')

async function seed() {
    try {
        const categorias = await Categoria.bulkCreate([
            { nome: 'Maquiagem', descricao: 'Batons, bases, paletas e muito mais' },
            { nome: 'Skincare', descricao: 'Séruns, hidratantes e cuidados com a pele' },
            { nome: 'Cabelos', descricao: 'Shampoos, óleos e finalizadores' },
            { nome: 'Body Care', descricao: 'Hidratantes e cuidados corporais' },
            { nome: 'Acessórios', descricao: 'Pincéis, esponjas e ferramentas' },
            { nome: 'Presentes', descricao: 'Kits e presentes especiais' }
        ])

        const [maquiagem, skincare, cabelos, bodyCare, acessorios, presentes] = categorias

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

        const senhaCriptografada = await bcrypt.hash('admin123', 10)
        await Usuario.create({
            nome: 'Administrador',
            email: 'admin@lumie.com',
            senha: senhaCriptografada,
            telefone: '(11) 90000-0000',
            cpf: '52998224725', 
            tipo_usuario: 'ADMIN',
            cep: '01310-100',
            logradouro: 'Avenida Paulista',
            bairro: 'Bela Vista',
            localidade: 'São Paulo',
            uf: 'SP',
            numero: '1000'
        })

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
