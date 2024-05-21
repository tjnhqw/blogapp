'use client'

import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import SimpleMDE from "react-simplemde-editor";
import client from '@/client';
import { getPost } from '@/graphql/queries';
import { Post } from '@/API';
import { updatePost } from '@/graphql/mutations';
import "easymde/dist/easymde.min.css";
import Image from 'next/image';
import { getUrl } from 'aws-amplify/storage';

type EditPostParams = {
  id: string;
}
function EditPost({ params }: { params: EditPostParams }) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const { id } = params;
  useEffect(() => {

    fetchPost()
  }, [id])
  const fetchPost = async () => {
    if (!id) return;
    const postData = await client.graphql({
      query: getPost,
      variables: { id }
    })
    const postWithImg = postData.data.getPost!
    if (postWithImg.coverImage) {
      const result = await getUrl({
        path: postWithImg.coverImage!,
      });
      postWithImg.coverImage = result.url.href;
    }
    setPost(postWithImg)

  }
  if (!post) return <h1>nO pOsT fOuNd</h1>

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }

  const { title, content } = post;

  const updateCurrentPost = async () => {
    if (!title || !content) return;

    const postUpdated = {
      id, title, content
    }

    const result = await client.graphql({
      query: updatePost,
      variables: { input: postUpdated },
      authMode: 'userPool'
    })
    if (result.errors) toast.error('Updated Failed!');
    if (result.data.updatePost) {
      toast.success('Successfully Updated!');
      router.push(`/my-posts`)
    }
  }
  return (
    <div className='w-full max-w-3xl mx-2 px-4'>
      <Toaster
        position='top-center'
        reverseOrder={false}
      />
      <h1 className='text-3xl text-center font-semibold tracking-wide mt-6 mb-2'>Edit post</h1>

      <input type='text' name='title' onChange={onChange} placeholder='Title' value={post.title} className='border-b pb-2 text-gray-500 text-lg placeholder-gray-500 py-2 my-4' />

      <SimpleMDE
        className='md:max-w-[50vw] max-w-[100vw]'
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />

      <Image src={post.coverImage!} alt={post.title} className='my-4 mx-2 max-w-56 h-auto' width={120} height={120} />
      <button className='my-4 float-right bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg' type='button' onClick={updateCurrentPost}>
        Save post
      </button>
    </div>
  );
}

export default EditPost;