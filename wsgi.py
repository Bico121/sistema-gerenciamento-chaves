#!/usr/bin/python3.10

import sys
import os

# Adicionar o diretório do projeto ao path
project_home = '/home/Bico12/pythonanywhere_app'  # Substitua 'seuusuario' pelo seu username do PythonAnywhere
if project_home not in sys.path:
    sys.path = [project_home] + sys.path

# Configurar variáveis de ambiente se necessário
os.environ['FLASK_ENV'] = 'production'

# Importar a aplicação Flask
from src.main import app as application

if __name__ == "__main__":
    application.run()

