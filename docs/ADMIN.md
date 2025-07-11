# Manual do Administrador - Dashboard Modular

## Acessando o Painel de Administração
- Acesse: `http://<ip_do_servidor>:8000/admin`
- O painel mostra todas as páginas configuradas

## Ativar/Desativar Páginas
- Use o botão "Ativo/Inativo" em cada cartão de página
- Páginas inativas não aparecem no dashboard

## Reordenar Páginas
- Arraste e solte os cartões para mudar a ordem
- A ordem define a sequência no carrossel

## Editando Páginas (config.json)
- Cada página tem um arquivo `config.json` em `pages/<nome>/`
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

## Extensibilidade
- O sistema aceita novos tipos de página no futuro (ex: "2x2", "full", etc). Consulte a documentação para padrões de novos tipos. 