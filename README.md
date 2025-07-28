# Sistema de Gerenciamento de Chaves

Sistema completo de gerenciamento de chaves de acesso com interface web e API REST, pronto para hospedagem no Render.

## 🚀 Funcionalidades

### Interface Web
- ✅ Dashboard com estatísticas em tempo real
- ✅ Criação de chaves com validade personalizada
- ✅ Validação de chaves com HWID
- ✅ Listagem completa de chaves
- ✅ Exclusão individual e em lote
- ✅ Interface responsiva e moderna

### API REST
- ✅ Endpoints completos para gerenciamento
- ✅ Validação de chaves com HWID único
- ✅ Estatísticas detalhadas
- ✅ CORS habilitado para integração

## 🛠️ Tecnologias

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Banco de Dados**: SQLite
- **Hospedagem**: Render (pronto para deploy)

## 📋 Pré-requisitos

- Python 3.11+
- Conta no GitHub
- Conta no Render (gratuita)

## 🔧 Instalação Local

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/sistema-gerenciamento-chaves.git
   cd sistema-gerenciamento-chaves
   ```

2. **Ative o ambiente virtual:**
   ```bash
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate     # Windows
   ```

3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Execute a aplicação:**
   ```bash
   python src/main.py
   ```

5. **Acesse no navegador:**
   ```
   http://localhost:5000
   ```

## 🌐 Deploy no Render

Siga o tutorial completo em `tutorial_hospedagem.txt` para fazer o deploy no Render.

### Resumo rápido:
1. Faça upload do projeto para o GitHub
2. Conecte o repositório no Render
3. Configure o serviço web
4. Aguarde o deploy automático

## 📚 API Endpoints

### Chaves
- `GET /api/keys` - Lista todas as chaves
- `POST /api/keys` - Cria uma nova chave
- `POST /api/keys/validate` - Valida chave com HWID
- `POST /api/keys/delete` - Deleta múltiplas chaves
- `DELETE /api/keys/{key}` - Deleta chave específica

### Estatísticas
- `GET /api/keys/stats` - Estatísticas das chaves
- `GET /api/health` - Status da API

## 💡 Exemplos de Uso

### Criar Chave
```bash
curl -X POST https://seu-app.onrender.com/api/keys \
  -H "Content-Type: application/json" \
  -d '{"days": 30, "created_by": "admin"}'
```

### Validar Chave
```bash
curl -X POST https://seu-app.onrender.com/api/keys/validate \
  -H "Content-Type: application/json" \
  -d '{"key": "ABC12345", "hwid": "hardware_id"}'
```

## 🔒 Segurança

- ✅ Cada chave pode ser usada por apenas um HWID
- ✅ Chaves expiram automaticamente
- ✅ Validação em tempo real
- ✅ Logs completos de atividade
- ✅ HTTPS automático no Render

## 📊 Estrutura do Banco

```sql
CREATE TABLE keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_value TEXT UNIQUE NOT NULL,
    expiry_date DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    hwid TEXT DEFAULT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_by TEXT DEFAULT 'system'
);
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

- 📧 Email: suporte@exemplo.com
- 📱 Telegram: @suporte
- 🌐 Website: https://exemplo.com

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no GitHub!

