'use client'

import { useMutation } from '@tanstack/react-query'
import { useSubscription } from '@trpc/tanstack-react-query'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HONO_URL, PROTOCOL } from '@/constants'
import { authClient } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc'

function App() {
  const { data: session, isPending, refetch } = authClient.useSession()
  const openExternalMutation = useMutation(trpc.oauth.openExternalUrl.mutationOptions())

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
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (session?.user) {
    const user = session.user
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="w-[320px] text-center">
          <CardHeader>
            <Avatar className="mx-auto mb-4 w-20 h-20">
              {user.image
                ? (
                    <AvatarImage src={user.image} alt={user.name || 'User avatar'} />
                  )
                : (
                    <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                  )}
            </Avatar>
            <CardTitle>
              Welcome,
              {user.name || user.email}
              !
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => authClient.signOut()}
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <Button
        onClick={async () => {
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
        }}
        className="px-8 py-4"
      >
        Login with GitHub
      </Button>
    </div>
  )
}

export default App
