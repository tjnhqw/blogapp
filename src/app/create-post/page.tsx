'use client'
import dynamic from "next/dynamic";
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { createPost } from '@/graphql/mutations';
import client from '@/client';
import "easymde/dist/easymde.min.css";
import '../../../configureAmplify'
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const SimpleMdeEditor = dynamic(
  () => import("react-simplemde-editor"),
  { ssr: false }
);
const initialState = {
  id: '',
  title: '',
  content: '',
  coverImage: ''
}

function CreatePost() {
  const [post, setPost] = useState(initialState);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const imageFileInput = useRef(null);
  const { title, content } = post
  const router = useRouter();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPost((post) => ({ ...post, title: e.target.value }))
  }
  const onChangeContent = useCallback((value: string) => {
    setPost((post) => ({ ...post, content: value }))
  }, []);
  async function createNewPost() {
    try {
      if (!title || !content) return;
      const id = uuidv4();
      post.id = id;

      if (image) {
        const fileName = `${uuidv4()}_${image.name}`
        const path = `public/images/${fileName}`
        post.coverImage = path;
        const result = await uploadData({
          path: path,
          data: image!,
          options: {
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes) {
                console.log(
                  `Upload progress ${Math.round((transferredBytes / totalBytes) * 100)
                  } %`
                );
              }
            }// Optional progress callback.
          }
        }).result
        console.log('Succeeded: ', result);

      }
      await client.graphql({
        query: createPost,
        variables: {
          input: post
        },
        authMode: 'userPool'
      })

      router.push(`/post/${post.id}`)
    } catch (error) {
      console.log('Error : ', error);
    }
  }

  /* const uploadImage = async () => {
    try {
      if (image) {
        const fileName = `${uuidv4()}_${image.name}`
        post.coverImage = fileName;
        const path = `public/images/${fileName}`
        const result = await uploadData({
          path: path,
          data: image!,
          options: {
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes) {
                console.log(
                  `Upload progress ${Math.round((transferredBytes / totalBytes) * 100)
                  } %`
                );
              }
            }// Optional progress callback.
          }
        }).result
        console.log('Succeeded: ', result);

      }
    } catch (error) {
      console.log('Error : ', error);

    }
  } */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const fileUploaded = (e.target as HTMLInputElement).files;
    const image = fileUploaded![0];
    const imgPreview = URL.createObjectURL(image);
    setImagePreview(imgPreview);
    if (!fileUploaded) return;
    setImage(image)
  }
  return (
    <Authenticator>
      <div className='flex flex-col p-8 w-screen md:w-[50vw]'>
        <h1>Create new post</h1>

        <input type='text' name='title' value={post.title} placeholder='Title' onChange={onChange}
          className='border-b px-2 py-2 pb-2 text-lg my-4 focus:outline-none w-full text-gray-500'
        />

        <SimpleMdeEditor
          className='md:max-w-[50vw] max-w-[100vw]'
          value={post.content}
          onChange={onChangeContent}
        />

        <input type='file' ref={imageFileInput} className='' onChange={handleChange} />
        {
          image && (
            <img src={imagePreview} className='my-4 mx-2 max-w-56 h-auto' />

          )
        }
        <button className='my-4 float-right bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg' type='button' onClick={createNewPost}>
          Create post
        </button>
        {/*  <button className='my-4 float-right bg-purple-500 text-white font-semibold px-8 py-2 rounded-lg' type='button' onClick={uploadImage}>
          Upload cover image
        </button> */}
      </div>
    </Authenticator>

  );
}

export default CreatePost;