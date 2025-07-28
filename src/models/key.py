from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Key(db.Model):
    __tablename__ = 'keys'
    
    id = db.Column(db.Integer, primary_key=True)
    key_value = db.Column(db.String(20), unique=True, nullable=False)
    expiry_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    hwid = db.Column(db.String(100), nullable=True)
    used = db.Column(db.Boolean, default=False)
    created_by = db.Column(db.String(50), default='system')
    
    def __repr__(self):
        return f'<Key {self.key_value}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'key_value': self.key_value,
            'expiry_date': self.expiry_date.isoformat(),
            'created_at': self.created_at.isoformat(),
            'hwid': self.hwid,
            'used': self.used,
            'created_by': self.created_by,
            'is_expired': self.expiry_date < datetime.utcnow()
        }
    
    def is_valid(self):
        return self.expiry_date > datetime.utcnow()
    
    def can_be_used_by(self, hwid):
        if not self.is_valid():
            return False
        return self.hwid is None or self.hwid == hwid

