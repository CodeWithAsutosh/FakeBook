import React, { useContext, useState } from 'react';
import './comments.scss';
import { AuthContext } from '../../context/authContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios.js';
import moment from 'moment';


const Comments = ({ postId }) => {

  const [desc, setDesc] = useState("");

  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments"], queryFn: () =>

      makeRequest.get("/comments?postId=" + postId).then((res) => {
        return res.data.data;
      })
  });

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["comments"]);
    },
  })

  const handleClick = async e => {
    e.preventDefault();
    mutation.mutate({ description: desc, postId: postId });
    setDesc("");
  };

  return (
    <div className='comments'>
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input type="text" placeholder='Write a comment'
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button style={{ marginTop: 0, width: 'fit-content' }} onClick={handleClick}>Send</button>
      </div>
      {isLoading ? "loading" : data.map(comment => (
        <div className="comment">
          <img src={comment.author.profilePic} alt="" />
          <div className="info">
            <span>{comment.author.firstName}</span>
            <p>{comment.description}</p>
          </div>
          <span className='date'>{moment(comment.createdAt).format("DD.MM.YYYY hh:mm A")}</span>
        </div>
      ))}
    </div>
  )
}

export default Comments;