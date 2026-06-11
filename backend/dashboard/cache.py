from django.core.cache import cache

def clear_dashboard_cache(user_id):
    cache.delete(f"provider_dashboard_{user_id}")
    cache.delete(f"customer_dashboard_{user_id}")