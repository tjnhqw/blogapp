


"use client"
import { useEffect, useState } from 'react';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import { AuthUser, getCurrentUser, signOut } from 'aws-amplify/auth';
import "../../../configureAmplify"

function Profile() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    checkUser();
  }, [])
  async function checkUser() {
    const user = await getCurrentUser();
    setUser(user)
  }
  if (!user) {
    return null;
  }
  async function handleSignOut() {
    await signOut()
  }

  return (
    <Authenticator>
      <h1 className='text-2xl font-semibold tracking-wide mt-6'>Profile</h1>
      <h1 className='my-2 text-gray-300'>{user.username}</h1>
      <p>{user.signInDetails?.loginId}</p>
      <button type="button" onClick={handleSignOut}>
        Sign out
      </button>
    </Authenticator>
  )
}

export default Profile