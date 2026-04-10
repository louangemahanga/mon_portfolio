# main/views.py
from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.contrib import messages
from .models import Profile, SocialLink, Service, SkillCategory, Project, Experience, ContactMessage

def home(request):
    # Récupération des données pour la page d'accueil
    profile = Profile.objects.first()
    
    context = {
        'profile': profile,
        'socials': SocialLink.objects.all(),
        'services': Service.objects.all(),
        'skill_categories': SkillCategory.objects.prefetch_related('skills').all(),
        'projects_dev': Project.objects.filter(category='dev'),
        'projects_reseau': Project.objects.filter(category='reseau'),
        'experiences': Experience.objects.all().order_by('-id'),
    }
    return render(request, 'index.html', context)

# main/views.py
# ... (le début du fichier reste pareil)

def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message_content = request.POST.get('message')

        # Sauvegarde en base de données
        ContactMessage.objects.create(name=name, email=email, message=message_content)

        # Envoi de l'email
        profile = Profile.objects.first()
        my_email = profile.contact_email if profile else None

        if my_email:
            try:
                send_mail(
                    f'Nouveau message de : {name}',
                    f"Email : {email}\n\nMessage :\n{message_content}",
                    email,              # Email de l'expéditeur
                    [my_email],         # Destinataire
                    fail_silently=False,
                )
                messages.success(request, '✅ Votre message a bien été envoyé !')
            
            except Exception as e:
                # CECI AFFICHERA L'ERREUR RÉELLE DANS LE TERMINAL
                print("------------------------------------------------")
                print(f"ERREUR D'ENVOI D'EMAIL : {e}")
                print("------------------------------------------------")
                messages.error(request, f"❌ Erreur technique : {e}")

        else:
            messages.error(request, "❌ Aucun email configuré dans le profil.")

        return redirect('home')

    return redirect('home')