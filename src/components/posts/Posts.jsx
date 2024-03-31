import React from 'react';
import Post from '../post/Post.jsx';
import './posts.scss';
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../axios.js';

const Posts = ({ userId }) => {

  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"], queryFn: () =>

      makeRequest.get("/posts?userId=" + userId).then((res) => {
        return res.data.data;
      })
  });

  return (
    <div className='posts'>
      {error ? "Something went wrong!"
        : isLoading
          ? "loading"
          : data.map((post) => (
            <div className="post">
              <Post post={post} key={post.id} />
            </div>
          ))}
    </div>
  )
}

export default Posts