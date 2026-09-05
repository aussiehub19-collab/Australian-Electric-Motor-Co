# Auth.md

Agent authentication recipe for **Australian Electric Motor Co** (https://australianelectricmotorco.com.au).

This service is **anonymous**: every resource is public, so there is no
registration, claim ceremony or token exchange. Discovery is still published so
agents can confirm that programmatically.

## Step 1 — Discover

### 1a. Protected Resource Metadata
Fetch: [`https://australianelectricmotorco.com.au/.well-known/oauth-protected-resource`](https://australianelectricmotorco.com.au/.well-known/oauth-protected-resource)

`Content-Type: application/json`. Fields: `resource`, `resource_name`,
`authorization_servers` (empty — no auth server), `scopes_supported` (empty),
`bearer_methods_supported` (empty), `resource_documentation` (this file).

### 1b. Authorization Server Metadata
Fetch: [`https://australianelectricmotorco.com.au/.well-known/oauth-authorization-server`](https://australianelectricmotorco.com.au/.well-known/oauth-authorization-server)

`issuer` is set; `authorization_endpoint`, `token_endpoint` and `jwks_uri`
are `null`. The profile-specific `agent_auth` block declares
`register_uri: null`, `identity_types_supported: ["none"]` and
`credential_types_supported: ["none"]`.

## Step 2 — Pick a method
The decision tree resolves to **anonymous**. Skip steps 3–5. No
`identity_assertion`, `service_auth` or registration is offered or required.

## Step 3 — Use resources
Call any public endpoint directly, no `Authorization` header:

| Resource | URL |
|---|---|
| Product catalogue (JSON) | https://australianelectricmotorco.com.au/api/products/ |
| Category list (JSON) | https://australianelectricmotorco.com.au/api/categories/ |
| Search (JSON) | https://australianelectricmotorco.com.au/api/search/ |
| MCP server | https://australianelectricmotorco.com.au/api/mcp/ |
| Full shop (HTML) | https://australianelectricmotorco.com.au/shop/ |
| Wholesale | https://australianelectricmotorco.com.au/wholesale/ |
| Guides | https://australianelectricmotorco.com.au/blog/ |
| FAQ | https://australianelectricmotorco.com.au/faq/ |

## Ordering
Human-in-the-loop required. Agents may browse and prepare order drafts via the
MCP server; a human completes checkout via WhatsApp or the order form.

## Errors
Standard HTTP status codes. `429` — back off and retry. No OAuth error codes
apply (no token layer).

## Revocation
Not applicable — no credentials are ever issued.
