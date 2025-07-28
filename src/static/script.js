// Configuração da API
const API_BASE = '/api';

// Carregar dados ao inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    loadKeys();
});

// Função para fazer requisições à API
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro na API:', error);
        showAlert('Erro de conexão com a API', 'danger');
        return { success: false, error: error.message };
    }
}

// Função para mostrar alertas
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.insertBefore(alertDiv, document.body.firstChild);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Carregar estatísticas
async function loadStats() {
    const result = await apiRequest('/keys/stats');
    
    if (result.success) {
        const stats = result.stats;
        document.getElementById('totalKeys').textContent = stats.total_keys;
        document.getElementById('activeKeys').textContent = stats.active_keys;
        document.getElementById('usedKeys').textContent = stats.used_keys;
        document.getElementById('expiredKeys').textContent = stats.expired_keys;
    }
}

// Criar nova chave
async function createKey() {
    const days = parseInt(document.getElementById('keyDays').value);
    const createdBy = document.getElementById('createdBy').value.trim();
    
    if (days < 1 || days > 365) {
        showAlert('Dias deve ser entre 1 e 365', 'warning');
        return;
    }
    
    if (!createdBy) {
        showAlert('Nome do criador é obrigatório', 'warning');
        return;
    }
    
    const result = await apiRequest('/keys', {
        method: 'POST',
        body: JSON.stringify({
            days: days,
            created_by: createdBy
        })
    });
    
    if (result.success) {
        showAlert(`Chave ${result.key.key_value} criada com sucesso!`, 'success');
        loadStats();
        loadKeys();
    } else {
        showAlert(`Erro ao criar chave: ${result.error}`, 'danger');
    }
}

// Validar chave
async function validateKey() {
    const key = document.getElementById('validateKey').value.trim();
    const hwid = document.getElementById('validateHwid').value.trim();
    
    if (!key || !hwid) {
        showAlert('Chave e HWID são obrigatórios', 'warning');
        return;
    }
    
    const result = await apiRequest('/keys/validate', {
        method: 'POST',
        body: JSON.stringify({
            key: key,
            hwid: hwid
        })
    });
    
    const resultDiv = document.getElementById('validateResult');
    
    if (result.success) {
        const alertClass = result.valid ? 'alert-success' : 'alert-danger';
        const icon = result.valid ? 'fas fa-check-circle' : 'fas fa-times-circle';
        
        resultDiv.innerHTML = `
            <div class="alert ${alertClass}">
                <i class="${icon} me-2"></i>
                <strong>${result.valid ? 'Válida' : 'Inválida'}:</strong> ${result.message}
            </div>
        `;
        
        if (result.valid && result.key_info) {
            const keyInfo = result.key_info;
            resultDiv.innerHTML += `
                <div class="alert alert-info">
                    <strong>Informações da Chave:</strong><br>
                    <small>
                        Criada: ${new Date(keyInfo.created_at).toLocaleString('pt-BR')}<br>
                        Expira: ${new Date(keyInfo.expiry_date).toLocaleString('pt-BR')}<br>
                        Criado por: ${keyInfo.created_by}
                    </small>
                </div>
            `;
        }
    } else {
        resultDiv.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Erro: ${result.error}
            </div>
        `;
    }
}

// Carregar lista de chaves
async function loadKeys() {
    const result = await apiRequest('/keys');
    
    if (result.success) {
        displayKeys(result.keys);
    } else {
        showAlert(`Erro ao carregar chaves: ${result.error}`, 'danger');
    }
}

// Exibir chaves na interface
function displayKeys(keys) {
    const keysList = document.getElementById('keysList');
    
    if (keys.length === 0) {
        keysList.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    Nenhuma chave encontrada
                </div>
            </div>
        `;
        return;
    }
    
    keysList.innerHTML = keys.map(key => {
        const isExpired = key.is_expired;
        const isUsed = key.used;
        
        let statusClass = 'status-active';
        let statusIcon = 'fas fa-check-circle';
        let statusText = 'Ativa';
        
        if (isExpired) {
            statusClass = 'status-expired';
            statusIcon = 'fas fa-times-circle';
            statusText = 'Expirada';
        } else if (isUsed) {
            statusClass = 'status-used';
            statusIcon = 'fas fa-user-check';
            statusText = 'Em Uso';
        }
        
        return `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card key-card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="card-title mb-0">
                                <code>${key.key_value}</code>
                            </h6>
                            <button class="btn btn-outline-danger btn-sm" onclick="deleteSingleKey('${key.key_value}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        
                        <div class="mb-2">
                            <small class="text-muted">Status:</small><br>
                            <span class="${statusClass}">
                                <i class="${statusIcon} me-1"></i>${statusText}
                            </span>
                        </div>
                        
                        <div class="mb-2">
                            <small class="text-muted">Criada:</small><br>
                            <small>${new Date(key.created_at).toLocaleString('pt-BR')}</small>
                        </div>
                        
                        <div class="mb-2">
                            <small class="text-muted">Expira:</small><br>
                            <small>${new Date(key.expiry_date).toLocaleString('pt-BR')}</small>
                        </div>
                        
                        <div class="mb-2">
                            <small class="text-muted">Criado por:</small><br>
                            <small>${key.created_by}</small>
                        </div>
                        
                        ${key.hwid ? `
                            <div>
                                <small class="text-muted">HWID:</small><br>
                                <small class="font-monospace">${key.hwid.substring(0, 20)}...</small>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Deletar chave única
async function deleteSingleKey(keyValue) {
    if (!confirm(`Tem certeza que deseja deletar a chave ${keyValue}?`)) {
        return;
    }
    
    const result = await apiRequest(`/keys/${keyValue}`, {
        method: 'DELETE'
    });
    
    if (result.success) {
        showAlert(`Chave ${keyValue} deletada com sucesso!`, 'success');
        loadStats();
        loadKeys();
    } else {
        showAlert(`Erro ao deletar chave: ${result.error}`, 'danger');
    }
}

// Mostrar modal de deletar múltiplas chaves
function showDeleteModal() {
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

// Deletar múltiplas chaves
async function deleteMultipleKeys() {
    const keysText = document.getElementById('keysToDelete').value.trim();
    
    if (!keysText) {
        showAlert('Digite as chaves para deletar', 'warning');
        return;
    }
    
    const keys = keysText.split(',').map(k => k.trim()).filter(k => k);
    
    if (keys.length === 0) {
        showAlert('Nenhuma chave válida encontrada', 'warning');
        return;
    }
    
    if (!confirm(`Tem certeza que deseja deletar ${keys.length} chave(s)?`)) {
        return;
    }
    
    const result = await apiRequest('/keys/delete', {
        method: 'POST',
        body: JSON.stringify({
            keys: keys
        })
    });
    
    if (result.success) {
        showAlert(`${result.deleted_count} de ${result.total_requested} chaves deletadas com sucesso!`, 'success');
        
        if (result.not_found.length > 0) {
            showAlert(`Chaves não encontradas: ${result.not_found.join(', ')}`, 'warning');
        }
        
        // Fechar modal e limpar campo
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        document.getElementById('keysToDelete').value = '';
        
        loadStats();
        loadKeys();
    } else {
        showAlert(`Erro ao deletar chaves: ${result.error}`, 'danger');
    }
}

