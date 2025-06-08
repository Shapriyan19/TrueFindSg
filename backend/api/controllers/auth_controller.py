import pyrebase
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from api.models import UserProfile

# Firebase configuration
config = {
    "apiKey": "AIzaSyBzxsu0jN_Ew7hZj0MV2fdQhWbmHyqAEJE",
    "authDomain": "truefindsg.firebaseapp.com",
    "databaseURL": "https://truefindsg-default-rtdb.asia-southeast1.firebasedatabase.app",
    "projectId": "truefindsg",
    "storageBucket": "truefindsg.firebasestorage.app",
    "messagingSenderId": "1072389490184",
    "appId": "1:1072389490184:web:6e28ebce6bcbb3021a33bd",
    "measurementId": "G-96M9M011QC"
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()

class GoogleSignInView(APIView):
    def post(self, request):
        try:
            # Get the ID token from the request
            id_token = request.data.get('idToken')
            if not id_token:
                return Response({'error': 'No ID token provided'}, status=status.HTTP_400_BAD_REQUEST)

            # Verify the ID token
            user = auth.sign_in_with_custom_token(id_token)
            
            # Get user info
            user_info = auth.get_account_info(user['idToken'])
            email = user_info['users'][0]['email']
            uid = user_info['users'][0]['localId']
            
            # Create or update user profile
            user_profile, created = UserProfile.objects.get_or_create(
                uid=uid,
                defaults={
                    'email': email,
                    'username': email.split('@')[0],  # Use email prefix as username
                }
            )
            
            if not created:
                user_profile.email = email
                user_profile.save()

            return Response({
                'message': 'Successfully authenticated',
                'user': {
                    'uid': uid,
                    'email': email,
                    'username': user_profile.username
                }
            })

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)