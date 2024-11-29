import hashlib, os, jwt
from django.conf import settings
from urllib.parse import urlencode
from django.urls import reverse_lazy
import requests


class OauthServiceGoogle:
    API_URI = reverse_lazy("google-oauth2-callback")

    GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/auth"
    GOOGLE_ACCESS_TOKEN_OBTAIN_URL = "https://oauth2.googleapis.com/token"
    GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

    SCOPES = [
        "openid",
        "email",
        "profile",
    ]

    @staticmethod
    def _create_state_session_token():
        state = hashlib.sha256(os.urandom(1024)).hexdigest()

        return state

    def _get_redirect_uri(self):
        domain = settings.FRONTEND_URL
        redirect_uri = f"{domain}{self.API_URI}"
        return redirect_uri

    def get_authorization_url(self):
        state = self._create_state_session_token()

        params_to_send = {
            "response_type": "code",
            "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
            "redirect_uri": self._get_redirect_uri(),
            "scope": " ".join(self.SCOPES),
            "state": state,
            "access_type": "offline",
            "prompt": "select_account",
        }

        query_params = urlencode(params_to_send)
        authorization_url = f"{self.GOOGLE_AUTH_URL}?{query_params}"

        return authorization_url, state

    def get_token(self, code:str):
        redirect_uri = self._get_redirect_uri()
        
        data_to_send = {
            "code": code,
            "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
            "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        }

        response = requests.post(self.GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data_to_send)
        
        if not response.ok:
            raise Exception(f"Failed to get token: {response.text}")
        
        token_data = response.json()
        access_token = token_data.get("access_token")
        decoded_id_token = jwt.decode(token_data.get("id_token"), options={"verify_signature": False})
        
        return access_token, decoded_id_token
    
    @staticmethod
    def _get_user_info(access_token:str):
        response = requests.get(OauthServiceGoogle.GOOGLE_USER_INFO_URL, params={"access_token": access_token})
        
        if not response.ok:
            raise Exception(f"Failed to get user info: {response.text}")
        
        return response.json()
