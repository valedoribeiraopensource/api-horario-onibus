# API Publica de - Registro/SP

Uma API simples em **Node.js** que fornece os horários de ônibus urbanos da cidade de Registro/SP. Ideal para integrar em sites, apps ou sistemas de transporte público.

---

## Funcionalidades

- Retorna todos os horários das linhas de ônibus.
- Retorna horários de uma linha específica.
- Permite buscar linhas por parte do nome.
- Fácil de estender adicionando novas linhas e horários no JSON.


## 📈 Roadmap & Melhorias Futuras

### Funcionalidades prioritárias:
- [ ] Suporte a horários de fins de semana e feriados
- [ ] Endpoint de próximo ônibus em tempo real, integrando GPS das linhas
- [ ] Filtros avançados: origem, destino, período do dia
- [ ] Paginação e limites para consultas grandes

### Performance e Escalabilidade:
- [ ] Cache de resultados frequentes (Redis ou similar)
- [ ] Rate-limiting para evitar sobrecarga
- [ ] Deploy em nuvem (Heroku, Railway, Vercel, AWS)

### Estrutura e Manutenção:
- [ ] Separar rotas, controllers e dados em pastas distintas
- [ ] Adicionar testes automatizados (Jest/Mocha)
- [ ] Suporte a banco de dados (MongoDB/PostgreSQL) para facilitar atualizações

### UX e Front-end (opcional):
- [ ] Front-end visual para consultar horários
- [ ] Integração com mapas para rotas e paradas



## 🤝 Contribuição

Contribuições são bem-vindas! Você pode:

- Adicionar novas linhas de ônibus e horários
- Criar endpoints adicionais (ex.: horários por dia da semana, horários noturnos)
- Melhorar a documentação e exemplos

### Passos para contribuir:

1. Fork o projeto  
2. Crie uma branch:

```bash
git checkout -b feature/nova-linha
