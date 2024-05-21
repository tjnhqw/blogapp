'use client'
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown'
import { v4 as uuidv4 } from 'uuid';
import { Post } from '@/API';
import client from '@/client';
import { getPost, listPosts } from '@/graphql/queries';
import { createComment } from '@/graphql/mutations';

const SimpleMdeEditor = dynamic(
  () => import("react-simplemde-editor"),
  { ssr: false }
);
import "easymde/dist/easymde.min.css";
import moment from 'moment';
import { Hub } from 'aws-amplify/utils';
import { getCurrentUser } from 'aws-amplify/auth';
async function getPostDetail(id: string) {
  const postData = await client.graphql({
    query: getPost,
    variables: {
      id: id
    }
  })
  return postData.data.getPost;
}
const init = { id: '', postID: '', message: "" };
function PostDetail({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post>();
  const [comment, setComment] = useState(init);
  const [showme, setShowme] = useState(false);
  const [signedUser, setSignedUser] = useState(false);

  const router = useRouter();
  const { message } = comment;
  const toggle = () => {
    setShowme(!showme)
  }
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
    const fetchData = async () => {
      const postData = await getPostDetail(params.id);
      console.log('postData: ', postData);
      setPost(postData!)
    }
    fetchData()
  }, [])
  useEffect(() => {

    authListener()
  }, [])
  if (!post) return (
    <h1>No post found</h1>
  );

  const createTheComment = async () => {
    if (!message) return;
    const id = uuidv4();
    comment.id = id;
    comment.postID = post.id;
    try {
      const result = client.graphql({
        query: createComment,
        variables: {
          input: comment
        },
        authMode: 'userPool'
      })
    } catch (error) {
      console.log('error::: ', error);
    }
    router.push('/my-posts')
  }
  return (
    <>
      <h1 className='text-4xl'>{post.title}</h1>
      <p className='text-sm font-light my-4'>By {post.username}</p>
      <div className='mt-8'>
        <ReactMarkdown className='prose'>{post.content}</ReactMarkdown>
      </div>
      {
        post.comments?.items.length! > 0 &&
        <div className='flex flex-col justify-center items-center'>
          {
            post.comments?.items.map((item) => (
              <div className='flex flex-col justify-center items-center' key={item?.id}>
                {item?.message}
                <span>on: {moment(post.createdAt).format("ddd, MMM hh:mm a")}</span>
                <span>created by:  {item?.createdBy}</span>
              </div>

            ))
          }
        </div>

      }
      {
        signedUser && (
          <button type='button' className='mb-4 bg-green-300 text-white font-semibold px-8 py-2 rounded-lg'
            onClick={toggle}>Write a comment</button>
        )
      }
      {
        <div style={{ display: showme ? 'block' : 'none' }}>
          <SimpleMdeEditor
            value={comment.message}
            onChange={(value) => setComment({ ...comment, message: value })}
          />
          <button className='mb-4 bg-slate-600 text-white font-semibold px-8 py-2 rounded-lg'
            onClick={createTheComment}
          >Save
          </button>
        </div>
      }
    </>
  );
}

// export async function generateStaticParams() {
//   const posts = await client.graphql({
//     query: listPosts,
//   })
//   const paths = posts.data.listPosts.items.map((post) => ({ id: post.id }))
//   console.log('paths: ', paths);
//   return paths
// }

export default PostDetail;