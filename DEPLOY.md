# Publicação do front-end de notas — Aula 08

Nesta branch, o aplicativo React utiliza a variável **VITE_API_URL**, com fallback para **http://localhost:3000/api/notes** quando ela não está configurada.

## Executar localmente

~~~bash
npm install
npm run dev
~~~

Mantenha a API local em execução para testar listagem, cadastro, edição e exclusão.

## Vercel

Importe o repositório usando o preset **Vite**, build **npm run build** e diretório de saída **dist**.

Na configuração de **Environment Variables**, adicione:

| Chave | Valor |
|---|---|
| VITE_API_URL | URL completa do endpoint publicado no Render, terminando em /api/notes |

Exemplo de formato, **não um endereço de produção real**: https://SEU-SERVICO.onrender.com/api/notes

Salve as variáveis e refaça o deploy. Teste em janela anônima. O endpoint precisa permitir CORS a partir da origem do front-end.

Não inclua segredos em variáveis com prefixo VITE_, pois elas são incorporadas ao código de front-end e podem ficar visíveis aos usuários.

Os ajustes desta branch ainda precisam de teste prático antes de serem integrados à main.
