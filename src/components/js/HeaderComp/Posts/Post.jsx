import '../../../css/Post.css'
import { useNavigate } from 'react-router-dom'

export default function Post({ postDetails, deletePost, isActiveNow, setShowDetailsWindow }) {

    const navigate = useNavigate();

    return (
        <div className="post">
            {isActiveNow == "myPosts" && <>
                <button onClick={() => { setShowDetailsWindow({ type: "updateTitle", flag: true, post: postDetails }) }}>🖊</button>
                <button onClick={() => deletePost(postDetails.id)}>🗑</button>
            </>
            }
            <div className="titleOfPost">
                <button title="Click me to see the body" onClick={() => navigate(`${postDetails.id}`)}>{postDetails.title}</button>
            </div>
            <h2 className="idOfPost">{postDetails.id}</h2>
        </div>
    )
}