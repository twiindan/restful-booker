# #5 - Require authentication for exporting

Description:

Our clients have identified a usecase where they need their accountants to be able to access their books for tax season. There is an extension for QuickBooks that can request and receive a couple of different formats from an endpoint. We will be providing them with an xml based on early conversations with clients. A key note, given the wider net of access to this request, we will need to implement authorisation.

Out of scope:

- Changing passwords
- Forgotten passwords
- Lock outs after failed attempts

Acceptance Criteria:

**Given** a request to export bookings
**When** the request does not include authorisation
**Then** the data is not returned

**Given** a request to export bookings
**When** the request is authorised to a client's account
**Then** the data is returned in a xml format

**Given** the an authorised data request is made
**When** the data is returned
**Then** there are fields for: ID, first name, last name, and total price

## Require authentication for exporting Implementation Options

### Basic Auth

Overview [https://kb.globalscape.com/KnowledgebaseArticle10691.aspx](https://kb.globalscape.com/KnowledgebaseArticle10691.aspx)

Basic authentication, or "basic auth" is formally defined in the Hypertext Transfer Protocol standard, RFC 1954. When a client (your browser) connects to a web server, it sends a "WWW-Authenticate: Basic" message in the HTTP header. Shortly after that, it sends your login credentials to the server using a mild obfuscation technique called base64 encoding. When HTTPS is used, these credentials are protected, so it's not considered insecure, which is why basic auth gained widespread use over the years. The biggest problem with basic auth has to do with the logging off the server, as most browsers tend to cache sessions and have inconsistently dealt with the need to properly close and clear connection states (or sessions) so that another (different) user couldn&#39;t log back in by refreshing the browser.

#### Technical implementation:

Export endpoint will take a basic authentication header consisting of a base64 encoding of the username and password: admin / password123

```
GET /export
Authorization: Basic YWRtaW46cGFzc3dvcmQxMjM=
```

### Session (Cookie) Based Auth

Overview [https://auth0.com/blog/cookies-vs-tokens-definitive-guide/](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)

Cookie based authentication is stateful. This means that an authentication record or session must be kept both server and client-side. The server needs to keep track of active sessions in a database, while on the front-end a cookie is created that holds a session identifier, thus the name cookie based authentication. Let&#39;s look at the flow of traditional cookie based authentication:

1. User enters their login credentials
2. Server verifies the credentials are correct and creates a session which is then stored in a database
3. A cookie with the session ID is placed in the users browser
4. On subsequent requests, the session ID is verified against the database and if valid the request processed
5. Once a user logs out of the app, the session is destroyed both client and server side

Technical implementation

Getting your token:

```
POST /auth
```

#### x-www-form-urlencoded - Request

```
username=admin&password=password123
```

#### x-www-form-urlencoded - Response

```
80b0428b3eace44
```

#### JSON - Request

```
{
    "username" : "admin",
    "password" : "password123"
}
```

#### JSON - Response

```
{
  "token" : "14bd80cd6f98398"
}
```

#### XML - Request

```
<auth>
  <username>admin</username>
  <password>password123</password>
</auth>
```

#### XML - Response

```
<token>6e562df22a8a869</token>
```

Using your token:

```
GET /export
Cookie: token={token_value}
```

### Token Based Auth

Overview: [https://auth0.com/blog/cookies-vs-tokens-definitive-guide/](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)

Token-based authentication has gained prevalence over the last few years due to rise of single page applications, web APIs, and the Internet of Things (IoT). When we talk about authentication with tokens, we generally talk about authentication with JSON Web Tokens (JWTs).

Token-based authentication is stateless. The server does not keep a record of which users are logged in or which JWTs have been issued. Instead, every request to the server is accompanied by a token which the server uses to verify the authenticity of the request. The token is generally sent as an addition Authorization header in form of Bearer {JWT}, but can additionally be sent in the body of a POST request or even as a query parameter. Let&#39;s see how this flow works:

1. User enters their login credentials
2. Server verifies the credentials are correct and returns a signed token
3. This token is stored client-side, most commonly in local storage - but can be stored in session storage or a cookie as well
4. Subsequent requests to the server include this token as an additional Authorization header or through one of the other methods mentioned above
5. The server decodes the JWT and if the token is valid processes the request
6. Once a user logs out, the token is destroyed client-side, no interaction with the server is necessary

Technical implementation

Getting your token:

```
POST /auth
```

#### x-www-form-urlencoded - Request

```
username=admin&password=password123
```

#### x-www-form-urlencoded - Response

```
80b0428b3eace44
```

#### JSON - Request

```
{
    "username" : "admin",
    "password" : "password123"
}
```

#### JSON - Response

```
{
  "token" : "14bd80cd6f98398"
}
```

#### XML - Request

```
<auth>
  <username>admin</username>
  <password>password123</password>
</auth>
```

#### XML - Response

```
<token>6e562df22a8a869</token>
```

Using your token:

```
GET /export?token={token}
```

## Some things to consider

- Security
- Usability
- Caching
- Testability
