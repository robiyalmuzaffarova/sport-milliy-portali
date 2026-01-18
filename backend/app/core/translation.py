"""
Translation Service for automatic multilingual support
Supports Uzbek (default), English, and Russian
"""
from typing import Dict, Optional
from functools import lru_cache
import asyncio
from deep_translator import GoogleTranslator
import redis.asyncio as aioredis

from app.core.config import settings


class TranslationService:
    """
    Service for translating text between languages
    Uses caching to improve performance
    """
    
    SUPPORTED_LANGUAGES = {
        'uz': 'uzbek',
        'en': 'english',
        'ru': 'russian'
    }
    
    DEFAULT_LANGUAGE = 'uz'
    
    def __init__(self):
        self.redis_client = None
        self.cache_prefix = "translation:"
        self.cache_ttl = 86400  # 24 hours
    
    async def _get_redis(self):
        """Get Redis client for caching"""
        if self.redis_client is None:
            self.redis_client = await aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True
            )
        return self.redis_client
    
    def _get_cache_key(self, text: str, source_lang: str, target_lang: str) -> str:
        """Generate cache key for translation"""
        return f"{self.cache_prefix}{source_lang}:{target_lang}:{hash(text)}"
    
    async def _get_cached_translation(
        self,
        text: str,
        source_lang: str,
        target_lang: str
    ) -> Optional[str]:
        """Get translation from cache"""
        try:
            redis = await self._get_redis()
            cache_key = self._get_cache_key(text, source_lang, target_lang)
            cached = await redis.get(cache_key)
            return cached
        except Exception as e:
            print(f"Cache get error: {e}")
            return None
    
    async def _cache_translation(
        self,
        text: str,
        source_lang: str,
        target_lang: str,
        translation: str
    ):
        """Cache translation"""
        try:
            redis = await self._get_redis()
            cache_key = self._get_cache_key(text, source_lang, target_lang)
            await redis.setex(cache_key, self.cache_ttl, translation)
        except Exception as e:
            print(f"Cache set error: {e}")
    
    async def translate(
        self,
        text: str,
        target_lang: str,
        source_lang: str = DEFAULT_LANGUAGE
    ) -> str:
        """
        Translate text from source language to target language
        
        Args:
            text: Text to translate
            target_lang: Target language code (uz, en, ru)
            source_lang: Source language code (default: uz)
        
        Returns:
            Translated text
        """
        # Skip if same language
        if source_lang == target_lang:
            return text
        
        # Validate languages
        if source_lang not in self.SUPPORTED_LANGUAGES:
            source_lang = self.DEFAULT_LANGUAGE
        
        if target_lang not in self.SUPPORTED_LANGUAGES:
            return text
        
        # Check cache first
        cached = await self._get_cached_translation(text, source_lang, target_lang)
        if cached:
            return cached
        
        # Perform translation
        try:
            # Use Google Translator as default
            if settings.TRANSLATION_SERVICE == "google":
                translator = GoogleTranslator(
                    source=self.SUPPORTED_LANGUAGES[source_lang],
                    target=self.SUPPORTED_LANGUAGES[target_lang]
                )
                translation = translator.translate(text)
            else:
                # Fallback to original text if service not available
                translation = text
            
            # Cache the translation
            await self._cache_translation(text, source_lang, target_lang, translation)
            
            return translation
        
        except Exception as e:
            print(f"Translation error: {e}")
            return text  # Return original text on error
    
    async def translate_dict(
        self,
        data: Dict,
        target_lang: str,
        source_lang: str = DEFAULT_LANGUAGE,
        fields_to_translate: Optional[list] = None
    ) -> Dict:
        """
        Translate specific fields in a dictionary
        
        Args:
            data: Dictionary with text fields
            target_lang: Target language code
            source_lang: Source language code
            fields_to_translate: List of field names to translate
        
        Returns:
            Dictionary with translated fields
        """
        if not fields_to_translate:
            # Default fields to translate
            fields_to_translate = ['title', 'description', 'content', 'name']
        
        translated_data = data.copy()
        
        for field in fields_to_translate:
            if field in data and isinstance(data[field], str):
                translated_data[field] = await self.translate(
                    data[field],
                    target_lang,
                    source_lang
                )
        
        return translated_data
    
    async def translate_list(
        self,
        items: list,
        target_lang: str,
        source_lang: str = DEFAULT_LANGUAGE,
        fields_to_translate: Optional[list] = None
    ) -> list:
        """
        Translate multiple items
        
        Args:
            items: List of dictionaries
            target_lang: Target language code
            source_lang: Source language code
            fields_to_translate: List of field names to translate
        
        Returns:
            List of dictionaries with translated fields
        """
        translated_items = []
        
        for item in items:
            if isinstance(item, dict):
                translated_item = await self.translate_dict(
                    item,
                    target_lang,
                    source_lang,
                    fields_to_translate
                )
                translated_items.append(translated_item)
            else:
                translated_items.append(item)
        
        return translated_items
    
    @staticmethod
    def get_supported_languages() -> Dict[str, str]:
        """Get list of supported languages"""
        return TranslationService.SUPPORTED_LANGUAGES


# Create singleton instance
translation_service = TranslationService()
