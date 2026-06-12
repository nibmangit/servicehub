from django.core.cache import cache

ONLINE_PREFIX = "online:user:"

class PresenceService:

    @staticmethod
    def set_online(user_id):
        cache.set(f"{ONLINE_PREFIX}{user_id}", True, timeout=60 * 5)

    @staticmethod
    def set_offline(user_id):
        cache.delete(f"{ONLINE_PREFIX}{user_id}")

    @staticmethod
    def is_online(user_id):
        return cache.get(f"{ONLINE_PREFIX}{user_id}") is not None