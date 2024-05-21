"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Hub } from 'aws-amplify/utils';
import { getCurrentUser } from 'aws-amplify/auth';
import '../../configureAmplify';

const items = [
  { name: 'Home', path: '/' },
  { name: 'Create Post', path: '/create-post' },
  { name: 'Profile', path: '/profile' },
]
const Navbar = () => {
  const [signedUser, setSignedUser] = useState(false);

  async function authListener() {
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signedIn":
          return setSignedUser(true);
        case "signedOut":
          return setSignedUser(false);
      }
    })
    try {
      const user = await getCurrentUser();
      if (user.userId) {
        setSignedUser(true)
      }
    } catch (error) {
      console.log('Error::: ', error);
    }
  }

  useEffect(() => {
    authListener()
  }, [])

  return (
    <nav className='w-full flex justify-around pt-4 pb-3 sm:space-x-4 space-x-0 border-b bg-cyan-300 border-gray-300'>
      {
        items.map((item, index) => (
          <Link href={item.path} key={index}>
            <span className='rounded px-3 py-2'>{item.name}</span>
          </Link>
        ))
      }
      {
        signedUser && (
          <Link href='/my-posts'>My post</Link>
        )
      }
    </nav>
  )
}
export default Navbar