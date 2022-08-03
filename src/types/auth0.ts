export type Auth0GoogleUser = {
  given_name: string
  family_name: string
  nickname: string
  name: string
  picture: string
  locale: 'en' | 'es'
  updated_at: string
  email: string
  email_verified: boolean
  sub: string
}

export type Auth0EmailUser = {
  nickname: string
  name: string
  picture: string
  updated_at: string
  email: string
  email_verified: boolean
  sub: string
}
