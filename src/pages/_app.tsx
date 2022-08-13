import '../styles/main.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChronoProvider } from '../context'
import { appWithTranslation } from 'next-i18next'

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
  return (
    <QueryClientProvider client={queryClient}>
      <ChronoProvider>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </ChronoProvider>
    </QueryClientProvider>
  )
}

export default appWithTranslation(MyApp)
