'use client'

import type { ReactNode } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useSubscription } from '@trpc/tanstack-react-query'
import { Button } from '@/components/ui/button'
import { HONO_URL, PROTOCOL } from '@/constants'
import { authClient } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc'

interface AuthGuardProps {
  children: ReactNode
  loadingFallback?: ReactNode
}

export function AuthGuard({ children, loadingFallback }: AuthGuardProps) {
  const { data: session, isPending, refetch } = authClient.useSession()
  const openExternalMutation = useMutation(trpc.oauth.openExternalUrl.mutationOptions())

  const handleDevelopmentClick = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: 'http://localhost:5173',
    })
  }

  const handleProductionClick = async () => {
    try {
      const response = await authClient.signIn.social({
        provider: 'github',
        callbackURL: `${PROTOCOL}://index.html`,
        disableRedirect: true,
      })

      if (response.data?.url) {
        await openExternalMutation.mutateAsync({ url: response.data.url })
      }
      else if (response.error) {
        console.error('Login failed:', response.error)
      }
    }
    catch (error) {
      console.error('Error during login:', error)
    }
  }

  useSubscription(trpc.oauth.onProtocolUrl.subscriptionOptions(undefined, {
    onData: async (url: string) => {
      console.warn('Received protocol URL:', url)
      try {
        const urlObj = new URL(url)
        const code = urlObj.searchParams.get('code')
        const state = urlObj.searchParams.get('state')

        if (code && state) {
          const response = await fetch(
            `${HONO_URL}/api/auth/callback/github?code=${code}&state=${state}`,
            { credentials: 'include' },
          )
          await response.text()
          await new Promise(resolve => setTimeout(resolve, 100))
          refetch()
        }
      }
      catch (error) {
        console.error('Error handling protocol URL:', error)
      }
    },
  }))

  if (isPending) {
    return loadingFallback ?? (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Button
          onClick={process.env.NODE_ENV === 'production' ? handleProductionClick : handleDevelopmentClick}
          className="px-8 py-4"
        >
          Login with GitHub
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
