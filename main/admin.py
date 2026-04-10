from django.contrib import admin
from .models import Profile, SocialLink, Service, SkillCategory, Skill, Project, Experience, ContactMessage

# Configuration pour afficher joliment les compétences dans l'admin
class SkillInline(admin.TabularInline):
    model = Skill
    extra = 1

class SkillCategoryAdmin(admin.ModelAdmin):
    inlines = [SkillInline]

# Enregistrement des modèles
admin.site.register(Profile)
admin.site.register(SocialLink)
admin.site.register(Service)
admin.site.register(SkillCategory, SkillCategoryAdmin)
admin.site.register(Project)
admin.site.register(Experience)
admin.site.register(ContactMessage)