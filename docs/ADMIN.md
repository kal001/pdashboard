# Manual do Administrador - Dashboard Modular

## Tipos de Dashboard Suportados

### 3x2 (6 widgets)
- Layout em grade 3x2 (3 colunas, 2 linhas), até 6 widgets.
- Campos principais no config.json:
  - `type`: "3x2"
  - `widgets`: array de até 6 widgets
  - `xlsx_file`: nome do ficheiro Excel em `/data/` com os dados
  - `template`, `css_file`, etc.

### 2x2 (4 widgets)
- Layout em grade 2x2 (2 colunas, 2 linhas), até 4 widgets.
- Campos principais no config.json:
  - `type`: "2x2"
  - `widgets`: array de até 4 widgets
  - `xlsx_file`: nome do ficheiro Excel em `/data/` com os dados
  - `template`, `css_file`, etc.

### Text MD (Markdown)
- Usa toda a área do dashboard para exibir texto formatado em Markdown.
- Não possui widgets.
- Campos principais no config.json:
  - `type`: "text-md"
  - `md_file`: nome do ficheiro Markdown em `/data/` (ex: `sample.md`)
  - `font_size`: tamanho da fonte (ex: "2.2rem", "40px", etc.)
  - `template`, `css_file`, etc.
- Suporta todos os recursos padrão de Markdown (tabelas, listas, citações, links, etc.).
- O ficheiro pode ser editado e reenviado via admin.

---

## Novidades na versão 1.1.0

### Internacionalização (i18n)
- Todo o painel de administração agora está disponível em Português e Inglês.
- Use o seletor de idioma no topo do painel para alternar instantaneamente entre os idiomas.
- Todos os textos, botões, mensagens e placeholders são traduzidos dinamicamente.

### Upload de Múltiplos Ficheiros
- O formulário de upload de dados agora permite selecionar e enviar vários ficheiros de uma só vez.
- Clique em "Selecionar ficheiros" para escolher múltiplos arquivos (Ctrl/Cmd + clique ou Shift + clique).
- O nome dos ficheiros selecionados (ou a contagem) aparece ao lado do botão.
- Clique em "Upload" para enviar todos os ficheiros de uma vez.
- O backend salva todos os ficheiros válidos e retorna mensagens de sucesso/erro para cada um.

### Input de Ficheiro Customizado
- O botão de upload foi modernizado: interface amigável, totalmente traduzível e consistente com o idioma selecionado.
- O texto do botão e as mensagens de status mudam conforme o idioma.

---

## Acessando o Painel de Administração
- Acesse: `http://<ip_do_servidor>:8000/admin`
- O painel mostra todas as páginas configuradas

## API e Documentação
- **Documentação Interativa:** `http://<ip_do_servidor>:8000/api/v1/docs/`
- **API REST:** Todos os endpoints para gestão programática
- **Swagger UI:** Teste endpoints diretamente no navegador

## Auto-Reload dos Clientes

O sistema inclui funcionalidade de auto-reload que atualiza automaticamente todos os dashboards conectados quando há alterações na configuração:

### Como Funciona
- **Detecção Automática:** O dashboard verifica mudanças na configuração a cada 30 segundos
- **Atualização Instantânea:** Quando detecta alterações, recarrega automaticamente a página
- **Sem Intervenção Manual:** Não é necessário refrescar manualmente os browsers dos clientes

### O que Dispara o Auto-Reload
- ✅ **Ativar/Desativar páginas** (via painel admin ou API)
- ✅ **Reordenar páginas** (via drag & drop no admin)
- ✅ **Alterações nos ficheiros config.json**
- ✅ **Qualquer mudança na configuração das páginas**

### Benefícios
- **Sincronização Automática:** Todos os displays mostram sempre a configuração mais recente
- **Zero Downtime:** Atualizações sem interrupção da visualização
- **Multi-Client:** Funciona em múltiplos browsers/displays simultaneamente

## Ativar/Desativar Páginas
- Use o botão "Ativo/Inativo" em cada cartão de página
- Páginas inativas não aparecem no dashboard
- **Via API:** POST `/api/v1/pages/{page_id}/toggle`

## Reordenar Páginas
- Arraste e solte os cartões para mudar a ordem
- A ordem define a sequência no carrossel
- **Via API:** POST `/api/v1/pages/reorder`

## Editando Páginas (config.json)
- Cada página tem um arquivo `config.json` em `pages/<nome>/`
- **💡 Lembrete:** Para ver a estrutura atual dos ficheiros, consulte `/pages/config.json` no painel admin
- Edite os campos:
  - `id`: identificador único
  - `title`: nome exibido
  - `type`: atualmente apenas "3x2"
  - `template`: template HTML usado (ex: carousel.html)
  - `css_file`: CSS específico (opcional)
  - `widgets`: array de widgets ativos

### Exemplo de config.json
```json
{
  "id": "producao3",
  "title": "Produção Linha 3",
  "type": "3x2",
  "template": "carousel.html",
  "css_file": "producao.css",
  "widgets": [
    { "id": "widget1", "active": true, "name": "Linha 3 - Equipamento A", "sheet": "ModeloA" },
    { "id": "widget2", "active": true, "name": "Linha 3 - Equipamento B", "sheet": "ModeloB" }
  ]
}
```

- Para adicionar widgets, inclua novos objetos no array `widgets`.
- O campo `active` controla se o widget aparece.

## Boas Práticas
- Sempre faça backup de `pages/` e `data/` antes de grandes alterações
- Use nomes claros para páginas e widgets
- Teste alterações em ambiente de desenvolvimento antes de aplicar em produção
- Use a API para automação e integração com outros sistemas

## Extensibilidade
- O sistema aceita novos tipos de página no futuro (ex: "2x2", "full", etc). Consulte a documentação para padrões de novos tipos. 