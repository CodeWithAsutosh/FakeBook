import React, { useContext, useState } from 'react';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from '../comments/Comments';
import './post.scss';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { makeRequest } from '../../axios.js';
import AuthContext from '../../context/authContext.jsx';

const Post = ({ post }) => {

    const [commentOpen, setCommentOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);


    const { currentUser } = useContext(AuthContext);

    const { isLoading, error, data } = useQuery(
        {   
            queryKey: ["likes", post.id], queryFn: () =>
            makeRequest.get("/likes/getlike?postId=" + post.id).then((res) => {
                    //console.log("like", res.data);
                    return res.data.data;
                })
        });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (liked) => {
            if (liked) return makeRequest.delete("/likes/addlike?postId=" + post.id);
            makeRequest.post("/likes", { postId: post.id });
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["likes"]);
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (postId) => {
            if (postId) return makeRequest.delete("/posts/" + postId);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["posts"]);
        },
    })

    const handleLike = () => {
        mutation.mutate(data.includes(currentUser.id));

    }

    const handleDelete = () => {
        deleteMutation.mutate(post.id);
    }

    return (
        <div className="post">
            <div className="container">
                <div className="user">
                    <div className="userInfo">
                        <img src={post.profilePic} alt="" />
                        <div className="details">
                            <Link
                                to={`/profile/${post.userId}`}
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                <span className="name">{post.name}</span>
                            </Link>
                            <span className="date">""</span>
                        </div>
                    </div>
                    <MoreHorizIcon onClick={() => setMenuOpen(!setMenuOpen)} />
                    {menuOpen && post.userId === currentUser.id && (
                        <button onClick={handleDelete}>Delete</button>
                    )}
                </div>
                <div className="content">
                    <p>{post.desc}</p>
                    <img src={"/upload/" + post.img} alt="" />
                </div>
                <div className="info">
                    <div className="item">
                        {isLoading ? (
                            "loading"
                        ) : (
                            data.includes(currentUser.id)) ? (
                            <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} />
                        ) : (
                            <FavoriteBorderOutlinedIcon onClick={handleLike} />
                        )}
                        {data.length} Likes
                    </div>
                    <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
                        <TextsmsOutlinedIcon />
                        12 Comments
                    </div>
                    <div className="item">
                        <ShareOutlinedIcon />
                        Share
                    </div>
                </div>
                {commentOpen && <Comments postId={post.Id} />}
            </div>
        </div>
    )
}

export default Post