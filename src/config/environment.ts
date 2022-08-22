export const environment = {
  db: {
    uri: process.env.DATABASE_URI ?? '',
  },
  env: process.env.NODE_ENV || 'development',
  auth0: {
    domain: process.env.AUTH0_ISSUER_BASE_URL ?? '',
    m2mClientId: process.env.AUTH0_M2M_CLIENT_ID ?? '',
    m2mClientSecret: process.env.AUTH0_M2M_CLIENT_SECRET ?? '',
  },
}
