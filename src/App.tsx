'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'

function App() {
  const { data: session, isPending } = authClient.useSession()

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
        onClick={() => authClient.signIn.social({
          provider: 'github',
          callbackURL: 'http://localhost:5173',
        })}
        className="px-8 py-4"
      >
        Login with GitHub
      </Button>
    </div>
  )
}

export default App
