export const environment = {
  db: {
    uri: process.env.DATABASE_URI ?? '',
  },
  env: process.env.NODE_ENV || 'development',
}
