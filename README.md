# Portfólio — Gabriel Viniciús

Site pessoal estático, responsivo e gratuito para apresentar projetos em candidaturas.

**Endereço:** https://programmergv.github.io/

## Sem custo de hospedagem

O site usa GitHub Pages em repositório público. Não há domínio comprado, backend, formulário externo, analytics, API paga ou dependências npm. Os arquivos e o vídeo são servidos pelo próprio GitHub Pages. A oferta gratuita do provedor está sujeita às regras e limites publicados por ele.

O site é independente de ChatGPT/Codex depois de publicado: visitantes não precisam de conta ou assinatura. O uso do assistente para desenvolver ou editar o código segue separadamente o plano da pessoa que o utiliza.

## Adicionar um projeto

1. No GitHub, abra `docs/projects.json` e clique em editar.
2. Adicione um objeto à lista, separado por vírgula. Exemplo mínimo:

```json
{
  "id": "meu-projeto",
  "title": "Nome do projeto",
  "category": "SOFTWARE / APLICAÇÃO WEB",
  "filters": ["web"],
  "description": "Qual problema o projeto resolve, sem prometer funcionalidades que ainda não existem.",
  "tags": ["Python", "Flask"],
  "repository": "https://github.com/ProgrammerGV/meu-projeto"
}
```

3. Para detalhar o estudo de caso, acrescente `problem`, `approach`, `evidence`, `limits` e `learning`.
4. Para usar uma captura real, envie o arquivo para `docs/assets/` e acrescente `image` (`assets/arquivo.png`), `image_alt` e `visual` (`edital`, para o estilo de captura). Sem imagem, deixe o padrão `generic`.
5. Os filtros aceitos são `ia`, `automacao` e `web`. Um projeto pode aparecer em mais de um.
6. Salve em `main`. O GitHub Pages atualizará a publicação; a disponibilidade pode levar alguns minutos.

Para trocar bio, experiência ou links de contato, edite `docs/index.html`. Não coloque credenciais ou informações privadas nesse repositório público.

## Executar localmente

Na raiz do repositório, com Python instalado:

```bash
python scripts/check_site.py
python -m http.server 5173 --bind 127.0.0.1 --directory docs
```

Abra `http://127.0.0.1:5173`. Abrir o HTML diretamente como arquivo pode bloquear a leitura de `projects.json`; use o servidor HTTP local.

## Publicação

GitHub → Settings → Pages → Source: **GitHub Actions**. O workflow `Portfolio CI/CD` valida arquivos, dados dos projetos e sintaxe JavaScript; somente após aprovação publica a pasta `docs` pelo GitHub Pages. Pull requests executam a validação sem publicar.

`.nojekyll` mantém a distribuição estática sem gerador de páginas. O workflow de verificação usa Python e bibliotecas padrão, sem instalar pacotes. Também é possível publicar a pasta `docs` em outro serviço de hospedagem estática, observando os termos e limites do provedor.

## Conteúdo e limites

Os dois projetos em destaque são Edital Inteligente e Rastreador de Editais. O Ford foi retirado da vitrine. As imagens abstratas são identificadas como estruturas dos projetos; capturas reais estão disponíveis nos detalhes.

As métricas de recuperação v1 do Edital Inteligente medem páginas, não respostas. A geração local v2 foi executada com Ollama e Llama 3.2 3B: 4/10 perguntas respondíveis atendidas corretamente e 6/6 casos ausentes recusados. A qualidade continua insuficiente para apresentar RAG completo; a busca é o modo principal e a geração é experimental. A avaliação é pequena e assistida por IA, sem revisão humana independente. Os relatórios, a origem do código e os limites estão no repositório do projeto.

O vídeo é uma sequência de capturas reais, sem gravação contínua. Os botões de contato abrem WhatsApp, LinkedIn ou o aplicativo de telefone; o envio da mensagem depende do visitante.

## Atualizar o currículo

Substitua `docs/assets/curriculo-gabriel-vinicius.pdf` pela versão atualizada mantendo o nome. O botão de abertura no início e o de download no contato usam esse mesmo arquivo.

## Aplicações online

O campo opcional `demo_url` em `docs/projects.json` adiciona um link de acesso ao projeto. `demo_label` define o texto do botão. Inclua somente endereços publicados e verificados. Os dois projetos em destaque têm endereços públicos verificados no Render Free. `render.yaml` registra a configuração dos serviços existentes. Os servidores gratuitos podem entrar em repouso e demorar no primeiro acesso.
