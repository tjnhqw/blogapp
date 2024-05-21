'use client'
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getCurrentUser } from 'aws-amplify/auth';
import moment from 'moment';
import { getUrl, remove } from 'aws-amplify/storage';
import Link from 'next/link';
import { getPost, postsByUsername } from '@/graphql/queries';
import { deletePost as deletePostMutation } from '@/graphql/mutations';
import client from '@/client';
import { Post } from '@/API';

import '../../../configureAmplify'
function MyPost() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {

    fetchPosts()
  }, [])
  const fetchPosts = async () => {
    const { username, userId } = await getCurrentUser();
    const postBy = userId + '::' + username
    const postData = await client.graphql({
      query: postsByUsername,
      variables: { username: postBy }
    })
    const { items } = postData.data.postsByUsername

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
  const deletePost = async (id: string, image: string) => {
    try {
      const postData = await client.graphql({
        query: getPost,
        variables: { id: id }
      })
      const image = postData.data.getPost?.coverImage;
      const result = await client.graphql({
        query: deletePostMutation,
        variables: {
          input: {
            id: id
          }
        },
        authMode: 'userPool'
      })
      if (result.errors) toast.error('Deleted Failed!');
      if (result.data.deletePost) {
        toast.success('Successfully deleted!');
        if (image?.startsWith('public')) {
          await remove({
            path: image,
          });
        }
        fetchPosts();
      }
    } catch (error) {
      console.log('Error ', error);
    }

  }

  return (
    <div className='w-full text-center'>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <h1 className='text-3xl font-semibold tracking-wide mt-6 mb-2'>My post</h1>
      {
        posts.map((post, index) => (
          <div className='py-8 px-8 flex sm:flex-row flex-col max-w-2xl mx-auto bg-white rounded-sm items-center space-x-6 mb-2' key={index}>
            <div className='text-center space-y-2 sm:text-left' >
              <div className='space-y-1'>
                <p className='text-lg text-black font-semibold'>{post.title}</p>
                <p className='text-slate-500 font-medium'>Created on: {moment(post.createdAt).format("ddd, MMM hh:mm a")}</p>

              </div>
              <div className='sm:flex sm:py-4 sm:items-center sm:space-y-0'>
                <p className='px-4 py-1 text-sm font-medium hover:bg-slate-300'>
                  <Link href={`/post/${post.id}`}>View post
                  </Link>
                </p>
                <p className='px-4 py-1 text-sm font-medium hover:bg-slate-300'>
                  <Link href={`/edit-post/${post.id}`}>Edit post
                  </Link>
                </p>
                <button className='mr-4 p-2 text-red-500 text-sm font-medium hover:bg-red-300' onClick={() => deletePost(post.id, post.coverImage!)}>
                  Delete post
                </button>
              </div>
            </div>
            <div className='flex'>
              {post.coverImage && <img src={post.coverImage} className='w-28 h-28 bg-contain bg-center sm:mx-0 sm:shrink-0 rounded-lg' />}
            </div>
          </div>

        ))
      }
    </div>

  );
}

export default MyPost;