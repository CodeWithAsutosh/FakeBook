import React, { useContext, useState, useEffect } from 'react';
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
import moment from 'moment';


const Post = ({ post, postId }) => {

    const [commentOpen, setCommentOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const { currentUser, currentUserID } = useContext(AuthContext);
    const [userIds, setUserIds] = useState([]);


    const { isLoading, error, data } = useQuery({
        queryKey: ["likes", postId], queryFn: () =>

            makeRequest.get("/likes/getlike?postId=" + postId).then((res) => {
                return res.data.data;
            }).catch((err) => {
                throw err;
            })
    });

    const { isLoading: commentIsLoading, error: commentError, data: commentData } = useQuery({
        queryKey: ["comments", postId], queryFn: () =>

            makeRequest.get("/comments?postId=" + postId).then((res) => {
                return res.data.data;
            }).catch((err) => {
                throw err;
            })
    });

    useEffect(() => {
        if (data && data.post) {
            const userIds = data.post.map(item => item.userId);
            setUserIds(userIds);
        }
    }, [data]);


    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (liked) => {
            if (liked) return makeRequest.delete("/likes/deleteLike?postId=" + postId);
            else return makeRequest.post("/likes/addlike?postId=" + postId);
        },
        onSuccess: () => {
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
        mutation.mutate(userIds.includes(currentUserID));
    }

    const handleDelete = () => {
        deleteMutation.mutate(postId);
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
                                <span className="name">{post.userId.firstName}</span>
                            </Link>
                            <span className="date">{moment(post.createdAt).format("DD-MM-YYYY hh:mm A")}</span>
                        </div>
                    </div>
                    <MoreHorizIcon onClick={() => setMenuOpen(!setMenuOpen)} />
                    {menuOpen && post.userId === currentUser.id && (
                        <button onClick={handleDelete}>Delete</button>
                    )}
                </div>
                <div className="content">
                    <p>{post.description}</p>
                    <img src={"/upload/" + post.img} alt="" />
                </div>
                <div className="info">
                    <div className="item">
                        {isLoading ? (
                            "Loading"
                        ) : (
                            (data && data.likesCount !== 0 && userIds.includes(currentUserID)) ? (
                                <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} />
                            ) : (
                                <FavoriteBorderOutlinedIcon onClick={handleLike} />
                            )
                        )}
                        {data ? data.likesCount : 0} Likes
                    </div>
                    <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
                        <TextsmsOutlinedIcon />
                        {commentIsLoading ? "Loading" : (
                            <>
                                {commentData ? commentData.length : 0} Comments
                            </>
                        )}
                    </div>
                    <div className="item">
                        <ShareOutlinedIcon />
                        Share
                    </div>
                </div>
                {commentOpen && <Comments postId={postId} />}
            </div>
        </div>
    )
}

export default Post