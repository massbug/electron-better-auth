'use client'

import { AuthGuard } from '@/components/auth-guard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'

function UserProfile() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  if (!user)
    return null

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

function App() {
  return (
    <AuthGuard>
      <UserProfile />
    </AuthGuard>
  )
}

export default App
