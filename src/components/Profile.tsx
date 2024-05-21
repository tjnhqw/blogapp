"use client"
import { useEffect, useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { AuthUser, getCurrentUser } from 'aws-amplify/auth';


function Profile() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    checkUser();
  }, [])
  async function checkUser() {
    const user = await getCurrentUser();
    console.log("user::: ", user);
    setUser(user)
  }
  if (!user) {
    return null;
  }

  return (
    <div>
      <h1 className='text-2xl font-semibold tracking-wide mt-6'>Profile</h1>
      <h1 className='my-2 text-gray-300'>{user.username}</h1>
      <p>{user.signInDetails?.loginId}</p>
    </div>
  )
}

export default withAuthenticator(Profile)