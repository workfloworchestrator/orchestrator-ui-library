# Orchestrator ui library

This repo contains the generally reusable parts of the orchestrator ui grouped and exposed as pages, components and elements such as Icons.
It is meant to be used together with an app that includes this library through NPM. For ease of development we have added the orchestrator example app implementation as a submodule in the folder /aps/wfo-ui.

To install and run the app

```
git clone git@github.com:workfloworchestrator/orchestrator-ui-library.git
git submodule init
git submodule update
cp apps/wfo-ui/.env.example apps/wfo-iu/.env
# change the values in the env file to point to your orchestrator backend
# set auth=false or follow the directions bellow this sections
npm i
npm run dev
```

This makes the orchestrator ui run on http://localhost:3000

# Authentication

-   set `AUTH_ACTIVE` env variable to false or use setup below with auth.

## AUTH with NextAuth and keycloak

setup auth with keycloak in docker.

-   copy apps env: `cp apps/wfo-ui/.env.example apps/wfo-ui/.env`.
    -   change `KEYCLOAK_ADMIN` and `KEYCLOAK_ADMIN_PASSWORD` to your own values.
    -   `NEXTAUTH_SECRET`: is NextAuth internal for JWT encryption and easily created with command `openssl rand -base64 32`.
    -   `NEXTAUTH_URL`: should be the base url to the auth page: `${FRONTEND_URL}/api/auth`.
    -   `NEXTAUTH_ID`: name of the provider which is shown in the `Sign in with {NEXTAUTH_ID}`, default is `keycloak`.
-   run `docker compose up -d` to start keycloak.
-   log into keycloak at http://localhost:8085
-   keycloak setup (use the `apps/{folder}` env):
    -   follow the [keycloak docs](https://www.keycloak.org/getting-started/getting-started-docker#_secure_the_first_application) to create a new realm and at least one user.
    -   after creating the realm, copy paste the url of the realm `http://{YOUR_KEYCLOAK_DOMAIN}/realms/{YOUR_REALM}` in your env as variable `NEXTAUTH_ISSUER`.
    -   Create a client.
        -   first page: fill in a name for `ClientID`. (`.env.example` default is `orchestrator-client`)
        -   second page: enable `Client authentication` and `Authorization`.
        -   third page fill in `Valid redirect URIs` and `Web Origins`:
            -   `Valid redirect URIs` with `{FRONTEND_URL}/api/auth/callback/{PROVIDER}`, with default provider its env variable `NEXTAUTH_ID`. (eg `http://localhost:3000/api/auth/callback/keycloak`)
            -   `Web Origins` with `{FRONTEND_URL}`. (eg `http://localhost:3000/`)
    -   go to the client details and go to tab `Credentials` and copy the Client secret and paste it into your env file. (`NEXTAUTH_CLIENT_SECRET`)
    -   run the app with `turbo dev`.
-   keycloak backend setup:
    -   Create another client in the same realm.
        -   first page: fill in a name for `ClientID`. (set the client id in your env (`OAUTH2_RESOURCE_SERVER_ID`)).
        -   second page: enable `Client authentication` and `Authorization`.
        -   third page: does not need any config.
    -   go to the client details and go to tab `Credentials` and copy the Client secret and pase it into your env file. (`OAUTH2_RESOURCE_SERVER_SECRET`)
    -   if you don't use authorization and only use authentication set `OAUTH2_AUTHORIZATION_ACTIVE` to `False`. if you do have authentication, you should set `OAUTH2_TOKEN_URL` to the inspection endpoint of your auth provider.
    -   run the backend.

# Release and publish

## Preparing the release

```bash
npm run packages:changeset
```

-   Include the changes made by this command in pull requests to the main branch
-   Selecting packages that will get a version bump
-   Specifies per selected package the type of version bump (`major`, `minor` or `patch`)
-   Adds a description or release notes for the release
-   All entries will be saved in a `.md` file in the `.changeset` folder

Once the pull-request with a changeset file is merged to the main branch another PR is opened by the Changesets-bot to update the version numbers of the packages. When this pull request gets merged to main an automatic publish to NPM will be performed.
