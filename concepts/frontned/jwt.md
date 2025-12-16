How JWT Works

JWT (JSON Web Token) is not used for authentication, but for authorization.
Authentication is the process of verifying who you are (login), while authorization is about what you are allowed to do after login—which resources you can access on the server.

Traditional Session / Cookie-Based Flow

In a traditional cookie-based system:

When you log in, the server creates a session.

The session data is stored on the server (in memory or a database).

The server sends a session ID to the client as a cookie.

On every request, the browser automatically sends this cookie.

The server uses the session ID to look up session data and verify the user.

Here, the server keeps track of the user state.

JWT-Based Flow

JWT works similarly in purpose but differently in implementation:

The user logs in with valid credentials.

The server creates a JWT:

Contains a payload (user ID, role, permissions, etc.)

Is signed using a secret key (or private key)

The server sends this JWT to the client.

The client stores the token (usually in memory or local storage).

For every subsequent request:

The client sends the token in the HTTP header:

Authorization: Bearer <jwt_token>


The server:

Verifies the token signature

Checks the payload and token expiry

Allows or denies access based on permissions

Here, the server does not store session state—it simply verifies the token.

Key Points to Remember

JWT is stateless (no server-side session storage).

JWT is mainly used for authorization, not authentication.

The token is signed, not encrypted (payload can be decoded).

If the signature is valid, the server trusts the token.

One-Line Summary (Interview Ready)

JWT is a stateless authorization mechanism where the server issues a signed token after login, and the client sends it with every request so the server can verify permissions without storing session data.

If you want, I can also:

Convert this into interview-style answer

Explain JWT vs cookies

Explain JWT security risks (XSS, token theft)

Draw a step-by-step flow diagram

✅ Pros of JWT

Stateless

Server does not store sessions.

Easy to scale (great for microservices & serverless).

Fast & Lightweight

No DB or cache lookup for every request.

Just verify the token signature.

Works Well Across Platforms

Can be used with web, mobile apps, and APIs.

No dependency on browser cookies.

Self-Contained

Payload can store user ID, roles, permissions, etc.

No need to fetch user data repeatedly.

Good for Distributed Systems

Multiple services can verify the same token using a shared secret/public key.

Standard & Widely Supported

Based on open standards (RFC 7519).

Supported in almost all backend frameworks.

❌ Cons of JWT

Cannot Be Easily Revoked

Once issued, a JWT is valid until it expires.

Logout is hard unless you maintain a blacklist.

Security Risks if Stored Incorrectly

Storing JWT in localStorage can lead to XSS attacks.

If stolen, attacker can act as the user.

Payload Is Not Encrypted

Anyone can decode the payload (Base64).

Sensitive data should NEVER be stored inside JWT.

Token Size Is Larger

JWT is bigger than a session ID.

Increases request size on every API call.

Expiration Handling Is Tricky

Short expiry → frequent re-login.

Long expiry → higher security risk.

Harder to Rotate Secrets

Changing the signing secret invalidates all existing tokens.

🆚 JWT vs Session Cookies (Quick Comparison)
Feature	JWT	Session Cookie
Server state	Stateless	Stateful
Scalability	High	Limited
Revocation	Hard	Easy
Security control	Medium	Strong
Best for	APIs, microservices	Traditional web apps
💡 When to Use JWT

Mobile apps

Public APIs

Microservices

Serverless architectures

🚫 When NOT to Use JWT

Simple monolithic apps

Apps needing frequent logout / revocation

Highly sensitive systems without strong security controls

Interview One-Liner

JWT is great for scalable, stateless authorization but comes with security and revocation challenges, so it must be used carefully.

If you want, I can also give:

JWT security best practices

How to handle logout with JWT

Access token vs Refresh token

JWT interview questions & answers


Basic JWT Interview Questions
1. Is JWT used for authentication or authorization?

Answer:
JWT is mainly used for authorization. Authentication happens during login; JWT is used after login to decide what the user can access.

2. Where is JWT stored on the client?

Answer:
Usually in memory, localStorage, or HTTP-only cookies.
HTTP-only cookies are the safest.

3. Is JWT encrypted?

Answer:
No. JWT is signed, not encrypted. Anyone can decode the payload, but they cannot change it without the secret key.

4. Why is JWT called stateless?

Answer:
Because the server does not store any session data. All required information is inside the token.

🔹 Tricky JWT Questions (Interview Favorites)
5. Can JWT be revoked?

Answer:
Not easily. JWT is valid until it expires unless you use token blacklisting or short expiry with refresh tokens.

6. What happens if someone steals a JWT?

Answer:
They can act as the user until the token expires.
That’s why short expiry and secure storage are important.

7. Why is JWT bad for logout?

Answer:
Because the server does not track tokens.
Once issued, the token remains valid until expiry.

8. Why not store sensitive data in JWT?

Answer:
Because the payload is Base64 encoded, not encrypted, and can be easily decoded.

🔹 JWT vs Cookies (Tricky Comparison)
9. JWT vs Session — which is more secure?

Answer:
Sessions are generally more secure because the server controls and can revoke them easily.

10. Why do people still use JWT if sessions are safer?

Answer:
JWT scales better and works well for APIs, mobile apps, and microservices.

🔹 Advanced but Simple Questions
11. What are the 3 parts of JWT?

Answer:

Header

Payload

Signature

header.payload.signature

12. What does the signature do?

Answer:
It ensures the token is not tampered with.
If payload changes, signature verification fails.

13. Why do we use Bearer in Authorization header?

Answer:
It tells the server that the token itself is enough to authorize the request.

14. Can JWT be used without HTTPS?

Answer:
No. Without HTTPS, the token can be intercepted.

🔹 Access Token & Refresh Token (Very Tricky)
15. Why use refresh tokens?

Answer:
To keep access tokens short-lived while allowing users to stay logged in securely.

16. Where should refresh tokens be stored?

Answer:
In HTTP-only cookies, never in localStorage.

17. What is token rotation?

Answer:
Each time a refresh token is used, a new one is issued to prevent reuse attacks.