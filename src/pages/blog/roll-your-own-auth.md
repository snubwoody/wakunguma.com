---
title: Maybe don't roll your own auth
preview: false
author: Wakunguma Kalimukwa
layout: ../../layouts/BlogLayout.astro
synopsis: Don't roll your own auth
image: /thumbnails/macros.png
imageSize: 12
published: 2025-08-30
tags:
  - Auth
---

The typical advice is not to roll your own auth. However on the surface level it seems fairly simple enough, all you need is an email, password and a user id, the rest is history. But it quickly becomes a project
itself. It's not that you can't, it's that you probably don't want to. Authentication is a side effect of having users, your users need accounts which need to be accessible and secure, hence your app needs authentication. However **you** don't to build authentication, it's merely something you need. Your time would be much better spent actually developing the product. 
All it takes is one simple mistake to screw everything up. Human dumb sometimes, human make mistake.

These are some providers that...:
- KeyCloak
- Clerk
- [Supabase](https://supabase.com/docs/guides/auth)

Alas you might want to roll your own so these are some of the things you'll need to keep track of:
- Email & Password Login
- Social Login
- Sessions across devices
- Email & password recovery
- Email change
- Password change
- Combining identities

## Emails

### Email validation
The **only** way to truly validate an email is by sending a code or key and requiring the user to enter that key on your website. Regex won't cut it. The following are all valid email addresses. 

- user@[192.168.2.1]
- "()<>[]:,;@\\\"!#$%&'-/=?^_`{}| ~.a"@example.org
- postmaster@[IPv6:2001:db8::1]


## Passwords
It's also important to make sure that users have strong enough password to prevent the changes of someone guessing their password and accessing their accounts. This involved searching registries for commonly used passwords or password that were found in a password leak. But brute force password guesses are relatively rare, the dangerous part is a user having their password leaked, which they use everywhere else. The ideal scenario would be to have users use password generators, but there isn't really a way to enforce that.

### Password change / recovery
The user will neeed the ability to change their password, almost always by sending a code, securely, to their email. This is also used if a user forgets their password.

### Email change
Similarly users will also need the ability to change thier emails.

## Combined identities
You might want a way to join identities. A user should be able to sign in with their email and password, as well as their google account with the same email.

## Session
A session is created when a user signs in, it allows them to use the app on that device as normal.

### Managing sessions
Users will need access to all the sessions they have across devices, with the ability to revoke any and all sessions.

## MFA
Multifactor Authentication (MFA) is when a user is required to present more than one type of evidence in order to authenticate on a system.

- Passkeys
- Authenticator apps
- Email address

### Passkeys
In my opinion, by far the most convinient way to log in to a website is using a [passkey](https://www.passkeys.io/), such as fingerprint or Face ID. It secure because you are who you are, and it is convenient and quick. Passkeys prevent all phishing based attacks.
