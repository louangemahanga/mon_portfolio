from django import template

register = template.Library()

@register.filter(name='split')
def split(value, key):
    """
    Permet de splitter une chaîne de caractères dans le template.
    Usage: {{ value|split:"," }}
    """
    return value.split(key)