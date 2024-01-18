import { useState } from "react";
import '../../../css/Post.css'

export default function Comment({ comment, setDetails, userEmail, deleteComment, setShowDetailsWindow }) {

    const [showUserDetails, setShowUserDetails] = useState(false);

    return (
        <>
            <button className="userName" title="Click me for more details" onClick={() => setShowUserDetails(show => !show)}>{comment.name}</button>
            {showUserDetails &&
                <h6 className="userEmail">Email: {comment.email}</h6>
            }
            <h6 className="commentBody">{comment.body}</h6>
            {comment.email == userEmail && <>
                <button onClick={() => { setDetails({ ...comment }); setShowDetailsWindow({ type: "update", flag: true }); }} >🖊</button>
                <button onClick={() => deleteComment(comment.id)}>🗑</button>
            </>
            }
        </>
    )
}