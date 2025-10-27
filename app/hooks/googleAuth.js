import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useEffect, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = '848604244331-0h0n9s57drk8ngpeb4niautl99ertkk6.apps.googleusercontent.com';
const DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

export function useGoogleAuth() {
  const [accessToken, setAccessToken] = useState(null);

  const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
});
console.log('🔗 redirectUri:', redirectUri);



  console.log('🔗 redirectUri:', redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri,
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
      responseType: 'token',
    },
    DISCOVERY
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      setAccessToken(access_token);
      console.log('✅ Token primit:', access_token);
    } else if (response) {
      console.log('⚠️ Raspuns auth:', response);
    }
  }, [response]);

  return { promptAsync, accessToken, request };
}

