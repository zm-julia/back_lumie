# Documentação de Engenharia - LUMIÉ

Esta pasta e a pasta `diagramas_UML/` contêm os artefatos de documentação exigidos
para a homologação da 1ª versão do sistema.

## Diagramas (`diagramas_UML/`)

- **diagrama_classes_UML.png** — Modelagem das 12 classes/entidades do sistema (atributos e
  relacionamentos com cardinalidade), no padrão UML.
- **diagrama_caso_de_uso.png** — Diagrama de Caso de Uso, com os atores Cliente e
  Administrador e suas respectivas funcionalidades no sistema.
- **diagrama_ER_atualizado_12_tabelas.png** — Modelo Entidade-Relacionamento atualizado,
  mostrando chaves primárias (PK), estrangeiras (FK) e únicas (UK) de todas as 12 tabelas.
  Complementa o `modelo_logico_.jpg` original (que cobre apenas as 7 tabelas obrigatórias).
- **modelo_logico.mwb / modelo_logico_.jpg** — Modelo lógico original do professor (7 tabelas).

## Documentos (`documentacao/`)

- **requisitos_e_infraestrutura.pdf** — Documento com:
  - Requisitos Funcionais (RF01 a RF19)
  - Requisitos Não-Funcionais (RNF01 a RNF08)
  - Regras de Negócio (RN01 a RN11)
  - Infraestrutura necessária (desenvolvimento, produção e integrações externas)

## Como os diagramas foram gerados

Os diagramas de classes e ER foram gerados a partir de descrições em texto (sintaxe Mermaid)
com a ferramenta de linha de comando `@mermaid-js/mermaid-cli`. O diagrama de caso de uso foi
montado em SVG e renderizado para PNG. Os arquivos-fonte (`.mmd`, script gerador do caso de
uso e script gerador do PDF) não fazem parte da entrega, mas podem ser fornecidos à parte
caso você queira reaproveitá-los ou editar algo.
