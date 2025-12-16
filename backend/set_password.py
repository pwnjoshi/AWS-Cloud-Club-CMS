from django.contrib.auth.models import User
u = User.objects.get(username='lead')
u.set_password('awsclub123')
u.save()
print("Password set for lead")
