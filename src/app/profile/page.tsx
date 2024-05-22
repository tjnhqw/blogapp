


"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Authenticator } from '@aws-amplify/ui-react';
import { AuthUser, getCurrentUser, signOut } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import "../../../configureAmplify"

function Profile() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();
  useEffect(() => {
    checkUser();

  }, [user])
  async function checkUser() {
    try {
      const user = await getCurrentUser();
      console.log('user: ', user);
      setUser(user)
    } catch (error) {
      console.log('error: ', error);
    }
  }

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }

  return (
    <Authenticator>
      <h1 className='text-2xl font-semibold tracking-wide mt-6'>Profile</h1>
      {user != null && (
        <>
          <h1 className='my-2 text-gray-300'>{user.username}</h1>
          <p>{user.signInDetails?.loginId}</p>
        </>
      )}
      <button type="button" onClick={handleSignOut}>
        Sign out
      </button>
    </Authenticator>
  )
}

export default Profile