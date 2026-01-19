## Setting up keycloak

Login in your keycloak instance, typically at http://localhost:8080

When modifying your client, make sure your Client authentication is OFF otherwise you will get invalid uri errors.

To include email address inside the jwt token, go to clients -> client details -> client scopes, select a scope, create a mapper of type user attribute, type email for user attribute and for token claim

To run both the backend and front end, from the using-alligator-sso directory type

Create a .env file inside alligator-backend directory

```
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=cfl
```

Create a .env file inside alligator-frontend directory as well

```
VITE_KEYCLOAK_REALM=cfl
VITE_KEYCLOAK_AUTH_SERVER_URL=http://localhost:8080/
VITE_KEYCLOAK_CLIENT_ID=alligator-admin // up to you if thats what you called your client
VITE_KEYCLOAK_CLIENT_SECRET=your-client-secret-here-get-it //
```

Then run both backend and frontend

```
npm install
npm run dev
```

To view the verification code, go to alligator-backend > src > middleware
