from django.core.cache import cache

ACTIVE_PREFIX = "active_chat:user:"

class ActiveChatService:

    @staticmethod
    def set_active(user_id, conversation_id):
        cache.set(f"{ACTIVE_PREFIX}{user_id}", conversation_id, timeout=60 * 10)

    @staticmethod
    def clear_active(user_id):
        cache.delete(f"{ACTIVE_PREFIX}{user_id}")

    @staticmethod
    def get_active(user_id):
        return cache.get(f"{ACTIVE_PREFIX}{user_id}")