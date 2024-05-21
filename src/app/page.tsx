"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link'
import { Authenticator } from '@aws-amplify/ui-react';
import { Post } from '@/API';
import client from '@/client';
import { listPosts } from '@/graphql/queries';
import { getUrl } from "aws-amplify/storage";
import '@aws-amplify/ui-react/styles.css';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      const posts = await client.graphql({
        query: listPosts,
      })
      const { items } = posts.data.listPosts
      const postWithImages = await Promise.all(
        items.map(async (post) => {
          if (post.coverImage) {
            const result = await getUrl({
              path: post.coverImage,
            });
            post.coverImage = result.url.href;
          }
          return post;
        })
      )
      setPosts(postWithImages)
    }
    fetchPost();
  }, [])


  return (
    <Authenticator>

      <main className="w-full max-w-3xl mx-4">
        {/*  <>
          {(user: AuthUser) => (
            <main>
              <h1>Hello {user?.username}</h1>
              <button onClick={() => signOut()}>Sign out</button>
            </main>
          )}
        </> */}
        <>
          {posts.map((post, index) => (
            <Link href={`/post/${post.id}`} key={index}>
              <div className='cursor-pointer border-b border-gray-200 mt-8 pb-4 mx-auto w-fit'>
                <div className='flex items-center'>
                  <div className='flex flex-col items-center mr-5'>
                    <h2 className='text-xl font-semibold'>{post.title}</h2>
                    <p className='text-gray-500 mt-2'>{post.username}</p>
                  </div>
                  {post.coverImage && <img src={post.coverImage} className='w-28 h-28 bg-contain bg-center sm:mx-0 sm:shrink-0 rounded-lg' />}
                </div>
              </div>
            </Link>
          ))}
        </>

      </main >

    </Authenticator>
  );
}
