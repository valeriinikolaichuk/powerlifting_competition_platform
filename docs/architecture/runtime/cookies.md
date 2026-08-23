## LanTokenService

The `LanTokenService` ensures that the `LAN` runtime has an authentication session before performing connection checks.

- sends a request to the backend to check whether an `access_token` cookie already exists.
- if the cookie does not exist, the backend creates an authentication token and sets it as an `access_token` cookie.
- if the cookie already exists, it is left unchanged.
- uses `withCredentials` to preserve the authentication cookie for subsequent requests.

The `LanTokenService` establishes the authentication session required by the LAN runtime. The backend creates an `access_token` cookie only when no valid `LAN` session cookie is already present.
