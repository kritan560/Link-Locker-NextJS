# <p align="center"> **Link Locker** </p>

Link Locker is a secure and convenient tool designed to help you manage and store your important links. With the Link Locker extension, you can easily save URLs from any website with just a click. Once logged in, the web app and extension take care of the rest, ensuring your links are safely stored in a personalized vault.

## Database Configuration

**DATABASE_URL**: The URL of your database connection string.

## Authentication

**AUTH_GITHUB_ID**: GitHub OAuth Client ID.
**AUTH_GITHUB_SECRET**: GitHub OAuth Client Secret.
**AUTH_GOOGLE_ID**: Google OAuth Client ID.
**AUTH_GOOGLE_SECRET**: Google OAuth Client Secret.
**AUTH_SECRET**: A secret key used for signing cookies and tokens in your authentication flow.

> [!IMPORTANT]
> Note: The authentication key should prefixed with `AUTH_` so that Auth JS can easily identify it.

## Email Configuration

**GMAIL_ID**: Your Gmail email address used for sending emails.
**GMAIL_PASS**: The app-specific password for your Gmail account.

## Application URL

**NEXT_PUBLIC_URL**: The public URL where your Next.js application is hosted. This is important for building proper links and for use in OAuth callbacks.

## Extension URL
**EXTENSION_URL**: The URL of the extension. This is used for the extension to communicate with the backend.