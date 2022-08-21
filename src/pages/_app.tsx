import '../styles/main.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChronoProvider } from '../context'
import { appWithTranslation } from 'next-i18next'
import Head from 'next/head'
import { environment } from '../config/environment'
import { useMemo } from 'react'

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retryDelay: 1000,
      retry: 2,
    },
  },
})

const MyApp = ({ Component, pageProps }: AppProps) => {
  const title = useMemo(() => `Chrono${environment.env === 'development' ? ' - Local' : ''}`, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ChronoProvider>
        <UserProvider>
          <Head>
            <title>{title}</title>
            <meta name="description" content="Chrono app to manage your time!" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />
        </UserProvider>
      </ChronoProvider>
    </QueryClientProvider>
  )
}

export default appWithTranslation(MyApp)
