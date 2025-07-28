from flask import Blueprint, request, jsonify
from src.models.key import db, Key
from datetime import datetime, timedelta
import random
import string

key_bp = Blueprint('key', __name__)

def generate_key():
    """Gera uma chave aleatória de 8 caracteres"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

@key_bp.route('/keys', methods=['GET'])
def get_all_keys():
    """Lista todas as chaves"""
    try:
        keys = Key.query.order_by(Key.created_at.desc()).all()
        return jsonify({
            'success': True,
            'keys': [key.to_dict() for key in keys],
            'total': len(keys)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@key_bp.route('/keys', methods=['POST'])
def create_key():
    """Cria uma nova chave"""
    try:
        data = request.get_json()
        days = data.get('days', 30)
        created_by = data.get('created_by', 'api')
        
        if days <= 0 or days > 365:
            return jsonify({
                'success': False,
                'error': 'Dias deve ser entre 1 e 365'
            }), 400
        
        # Gerar chave única
        attempts = 0
        while attempts < 10:
            key_value = generate_key()
            existing = Key.query.filter_by(key_value=key_value).first()
            if not existing:
                break
            attempts += 1
        
        if attempts >= 10:
            return jsonify({
                'success': False,
                'error': 'Erro ao gerar chave única'
            }), 500
        
        # Criar nova chave
        new_key = Key(
            key_value=key_value,
            expiry_date=datetime.utcnow() + timedelta(days=days),
            created_by=created_by
        )
        
        db.session.add(new_key)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'key': new_key.to_dict(),
            'message': f'Chave {key_value} criada com sucesso'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@key_bp.route('/keys/validate', methods=['POST'])
def validate_key():
    """Valida uma chave com HWID"""
    try:
        data = request.get_json()
        key_value = data.get('key')
        hwid = data.get('hwid')
        
        if not key_value or not hwid:
            return jsonify({
                'success': False,
                'valid': False,
                'error': 'Key e HWID são obrigatórios'
            }), 400
        
        key = Key.query.filter_by(key_value=key_value).first()
        
        if not key:
            return jsonify({
                'success': True,
                'valid': False,
                'message': 'Chave não encontrada'
            })
        
        if not key.is_valid():
            return jsonify({
                'success': True,
                'valid': False,
                'message': 'Chave expirada'
            })
        
        if key.hwid is None:
            # Primeira vez usando a chave, registrar HWID
            key.hwid = hwid
            key.used = True
            db.session.commit()
            
            return jsonify({
                'success': True,
                'valid': True,
                'message': 'Chave válida e HWID registrado',
                'key_info': key.to_dict()
            })
        
        elif key.hwid == hwid:
            return jsonify({
                'success': True,
                'valid': True,
                'message': 'Chave válida para este HWID',
                'key_info': key.to_dict()
            })
        
        else:
            return jsonify({
                'success': True,
                'valid': False,
                'message': 'Chave já está em uso por outro dispositivo'
            })
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@key_bp.route('/keys/delete', methods=['POST'])
def delete_keys():
    """Deleta múltiplas chaves"""
    try:
        data = request.get_json()
        key_values = data.get('keys', [])
        
        if not key_values:
            return jsonify({
                'success': False,
                'error': 'Lista de chaves é obrigatória'
            }), 400
        
        deleted_count = 0
        not_found = []
        
        for key_value in key_values:
            key = Key.query.filter_by(key_value=key_value.strip()).first()
            if key:
                db.session.delete(key)
                deleted_count += 1
            else:
                not_found.append(key_value)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'deleted_count': deleted_count,
            'total_requested': len(key_values),
            'not_found': not_found,
            'message': f'{deleted_count} chaves deletadas com sucesso'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@key_bp.route('/keys/<key_value>', methods=['DELETE'])
def delete_single_key(key_value):
    """Deleta uma chave específica"""
    try:
        key = Key.query.filter_by(key_value=key_value).first()
        
        if not key:
            return jsonify({
                'success': False,
                'error': 'Chave não encontrada'
            }), 404
        
        db.session.delete(key)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Chave {key_value} deletada com sucesso'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@key_bp.route('/keys/stats', methods=['GET'])
def get_stats():
    """Retorna estatísticas das chaves"""
    try:
        total_keys = Key.query.count()
        active_keys = Key.query.filter(Key.expiry_date > datetime.utcnow()).count()
        used_keys = Key.query.filter_by(used=True).count()
        expired_keys = Key.query.filter(Key.expiry_date <= datetime.utcnow()).count()
        
        return jsonify({
            'success': True,
            'stats': {
                'total_keys': total_keys,
                'active_keys': active_keys,
                'used_keys': used_keys,
                'expired_keys': expired_keys,
                'unused_keys': total_keys - used_keys
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@key_bp.route('/health', methods=['GET'])
def health_check():
    """Verifica se a API está funcionando"""
    return jsonify({
        'success': True,
        'status': 'online',
        'message': 'API de gerenciamento de chaves funcionando',
        'timestamp': datetime.utcnow().isoformat()
    })

