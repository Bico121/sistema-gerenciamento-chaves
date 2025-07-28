# Sistema de Gerenciamento de Chaves - PythonAnywhere

Sistema completo de gerenciamento de chaves de acesso com interface web e API REST, otimizado para hospedagem 24/7 no PythonAnywhere.

## 🚀 Características Específicas para PythonAnywhere

### Hospedagem 24/7 Gratuita
- ✅ Não entra em "sleep" como outras plataformas
- ✅ HTTPS automático incluído
- ✅ Domínio gratuito (.pythonanywhere.com)
- ✅ Integração direta com GitHub

### Configurações Otimizadas
- ✅ Arquivo WSGI configurado para PythonAnywhere
- ✅ Estrutura de diretórios compatível
- ✅ Dependências testadas no ambiente Python 3.10
- ✅ Banco SQLite com persistência garantida

## 📋 Arquivos Importantes

- `wsgi.py` - Arquivo de configuração WSGI para PythonAnywhere
- `tutorial_pythonanywhere.txt` - Tutorial completo de deploy
- `requirements.txt` - Dependências Python
- `src/main.py` - Aplicação Flask principal

## 🔧 Deploy Rápido

1. **Criar conta no PythonAnywhere** (gratuita)
2. **Fazer upload para GitHub** (todos os arquivos deste ZIP)
3. **Clonar no PythonAnywhere** via console bash
4. **Configurar aplicação web** seguindo o tutorial
5. **Ativar e testar** a API

## 🌐 URL da Aplicação

Após o deploy, sua API estará disponível em:
```
https://seuusuario.pythonanywhere.com
```

## 📚 Endpoints da API

- `GET /api/keys` - Lista todas as chaves
- `POST /api/keys` - Cria nova chave
- `POST /api/keys/validate` - Valida chave com HWID
- `POST /api/keys/delete` - Remove múltiplas chaves
- `GET /api/keys/stats` - Estatísticas do sistema
- `GET /api/health` - Status da API

## 🔒 Segurança

- ✅ HTTPS obrigatório (automático no PythonAnywhere)
- ✅ CORS configurado para integração
- ✅ Validação de HWID único por chave
- ✅ Expiração automática de chaves

## 📊 Limitações do Plano Gratuito

- **CPU**: 100 segundos por dia
- **Espaço**: 512MB
- **Apps**: 1 aplicação web
- **Domínio**: Fixo (.pythonanywhere.com)

## 🆙 Atualizações

Para atualizar a aplicação:
```bash
cd ~/pythonanywhere_app
git pull origin main
# Recarregar na aba "Web" do dashboard
```

## 📞 Suporte

- 📖 Tutorial completo: `tutorial_pythonanywhere.txt`
- 🌐 Documentação PythonAnywhere: https://help.pythonanywhere.com/
- 🔧 Logs de erro: Disponíveis no dashboard "Web"

---

⭐ **Vantagem**: Diferente do Heroku/Render, o PythonAnywhere mantém sua aplicação rodando 24/7 sem entrar em sleep mode!

