# main/models.py
from django.db import models

class Profile(models.Model):
    name = models.CharField(max_length=100, default="Votre Nom")
    title = models.CharField(max_length=200, default="Développeur Full Stack")
    bio = models.TextField(help_text="Description pour la section 'À Propos'")
    photo = models.ImageField(upload_to='profile/', blank=True, null=True)
    cv = models.FileField(upload_to='cv/', blank=True, null=True)
    status = models.CharField(max_length=50, default="Disponible pour missions")
    
    # === NOUVEAU CHAMP AJOUTÉ ICI ===
    contact_email = models.EmailField(default="votre.email@exemple.com", help_text="L'adresse où vous recevrez les messages du formulaire de contact")
    
    projects_count = models.IntegerField(default=15)
    experience_years = models.IntegerField(default=3)
    tech_count = models.IntegerField(default=10)

    def __str__(self):
        return self.name

class SocialLink(models.Model):
    name = models.CharField(max_length=50)
    url = models.URLField()
    icon_class = models.CharField(max_length=50, help_text="Classe Font Awesome ex: fab fa-github")
    
    def __str__(self):
        return self.name

class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon_class = models.CharField(max_length=50, help_text="Classe Font Awesome ex: fas fa-server")

    def __str__(self):
        return self.title

# IMPORTANT : SkillCategory DOIT être défini AVANT Skill
class SkillCategory(models.Model):
    name = models.CharField(max_length=50, help_text="ex: Back-End, Front-End...")
    css_class = models.CharField(max_length=50, default="cat-backend", help_text="ex: cat-backend, cat-frontend...")

    class Meta:
        verbose_name_plural = "Skill Categories"

    def __str__(self):
        return self.name

# Maintenant Skill peut trouver SkillCategory
class Skill(models.Model):
    name = models.CharField(max_length=50)
    icon_class = models.CharField(max_length=50, help_text="Classe Devicon ex: devicon-django-plain")
    category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, related_name='skills')

    def __str__(self):
        return self.name

class Project(models.Model):
    CATEGORY_CHOICES = [
        ('dev', 'Développement'),
        ('reseau', 'Réseau & Infra'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='dev')
    project_type = models.CharField(max_length=50, default="Web App", help_text="ex: Web App, Mobile, API")
    link = models.URLField(blank=True, null=True)
    github = models.URLField(blank=True, null=True)
    technologies = models.CharField(max_length=200, help_text="Séparez par des virgules: Django, React, MySQL")
    
    def __str__(self):
        return self.title

class Experience(models.Model):
    date_range = models.CharField(max_length=50, help_text="ex: 2023 — Présent")
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return f"{self.title} @ {self.company}"

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message de {self.name}"