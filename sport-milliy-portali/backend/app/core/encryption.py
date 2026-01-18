"""
Encryption utilities for sensitive data protection
"""
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2
import base64
import os

from app.core.config import settings


class EncryptionService:
    """
    Service for encrypting and decrypting sensitive data
    Uses Fernet (symmetric encryption) with AES-256
    """
    
    def __init__(self):
        self.cipher_suite = self._create_cipher()
    
    def _create_cipher(self) -> Fernet:
        """
        Create Fernet cipher from SECRET_KEY
        """
        # Derive a key from SECRET_KEY
        kdf = PBKDF2(
            algorithm=hashes.SHA256(),
            length=32,
            salt=b'sport_milliy_portali_salt',  # In production, use random salt
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(
            kdf.derive(settings.SECRET_KEY.encode())
        )
        return Fernet(key)
    
    def encrypt(self, data: str) -> str:
        """
        Encrypt string data
        
        Args:
            data: Plain text string to encrypt
        
        Returns:
            Encrypted string (base64 encoded)
        """
        encrypted = self.cipher_suite.encrypt(data.encode())
        return encrypted.decode()
    
    def decrypt(self, encrypted_data: str) -> str:
        """
        Decrypt encrypted data
        
        Args:
            encrypted_data: Encrypted string
        
        Returns:
            Decrypted plain text string
        """
        try:
            decrypted = self.cipher_suite.decrypt(encrypted_data.encode())
            return decrypted.decode()
        except Exception as e:
            print(f"Decryption error: {e}")
            return ""
    
    def encrypt_dict(self, data: dict, fields_to_encrypt: list) -> dict:
        """
        Encrypt specific fields in a dictionary
        
        Args:
            data: Dictionary with data
            fields_to_encrypt: List of field names to encrypt
        
        Returns:
            Dictionary with encrypted fields
        """
        encrypted_data = data.copy()
        
        for field in fields_to_encrypt:
            if field in data and data[field]:
                encrypted_data[field] = self.encrypt(str(data[field]))
        
        return encrypted_data
    
    def decrypt_dict(self, data: dict, fields_to_decrypt: list) -> dict:
        """
        Decrypt specific fields in a dictionary
        
        Args:
            data: Dictionary with encrypted data
            fields_to_decrypt: List of field names to decrypt
        
        Returns:
            Dictionary with decrypted fields
        """
        decrypted_data = data.copy()
        
        for field in fields_to_decrypt:
            if field in data and data[field]:
                decrypted_data[field] = self.decrypt(data[field])
        
        return decrypted_data


# Create singleton instance
encryption_service = EncryptionService()
