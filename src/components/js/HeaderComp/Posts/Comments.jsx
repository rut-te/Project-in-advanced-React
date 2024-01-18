import Comment from "./Comment"
import { useEffect, useState } from "react"
import EnterCommentDetails from './EnterCommentDetails.jsx'
import Exeption from "../../Exeption.jsx";
import SuccessfulOperation from '../../SuccessfulOperation.jsx'

export default function Comments({ postId }) {

    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState();
    const [showDetailsWindow, setShowDetailsWindow] = useState({ type: "", flag: false });
    const [details, setDetails] = useState({});
    const [exeption, setExeption] = useState(false);
    const [messege, setMessege] = useState({ flag: false, string: "" });

    useEffect(() => {
        setIsLoading(true);
        const postComments = JSON.parse(localStorage.getItem(`commentsOf${postId}`));
        if (!postComments) {
            getComments();
        }
        else {
            setComments(postComments);
        }
        setIsLoading(false);
    }, []);

    let userEmail, userName;

    function getUserEmail() {
        const keys = Object.keys(localStorage);
        const userInfo = JSON.parse(localStorage.getItem(keys[0]));
        userEmail = userInfo.email;
        userName = userInfo.name;
    }

    getUserEmail();

    async function getComments() {
        try {
            const response = await fetch(`http://localhost:3000/comments?postId=${postId}`);
            const resData = await response.json();
            if (response.ok) {
                localStorage.setItem(`commentsOf${postId}`, JSON.stringify(resData));
                setComments(resData);
            }
            else {
                throw new Error(response.status)
            }
        }
        catch (e) {
            console.log(e);
            setExeption(true);
            setTimeout(() => {
                setExeption(false);
            }, 5000);
        }
    }

    async function addComment() {
        setShowDetailsWindow({ type: "", flag: false });
        try {
            const response = await fetch(`http://localhost:3000/comments`, {
                method: 'POST',
                body: JSON.stringify(
                    {
                        postId: postId,
                        name: userName,
                        email: userEmail,
                        body: details.body
                    }
                ),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (response.ok) {
                const resData = await response.json();
                let newArrComments = JSON.parse(localStorage.getItem(`commentsOf${postId}`));
                newArrComments.push(resData);
                localStorage.setItem(`commentsOf${postId}`, JSON.stringify(newArrComments));
                setComments([...newArrComments]);
                setMessege({ flag: true, string: "addition" });
                setTimeout(() => {
                    setMessege({ flag: false, string: "" });
                }, 5000);
            }
            else {
                throw new Error(response.status)
            }
        }
        catch (e) {
            console.log(e);
            setExeption(true);
            setTimeout(() => {
                setExeption(false);
            }, 5000);
        }
    }

    async function updateComment() {
        setShowDetailsWindow({ type: "", flag: false });
        try {
            const response = await fetch(`http://localhost:3000/comments/${details.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    body: details.body
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (response.ok) {
                const resData = await response.json();
                let currentArrComments = comments;
                let newArrComments = JSON.parse(localStorage.getItem(`commentsOf${postId}`));
                const commentsToUpdate = newArrComments.find((obj) => obj.id == details.id);
                newArrComments[newArrComments.indexOf(commentsToUpdate)].body = resData.body;
                localStorage.setItem(`commentsOf${postId}`, JSON.stringify(newArrComments));
                const currentCommentsToUpdate = currentArrComments.find((obj) => obj.id == details.id);
                currentArrComments[currentArrComments.indexOf(currentCommentsToUpdate)].body = resData.body;
                setComments([...currentArrComments]);
                setMessege({ flag: true, string: "update" });
                setTimeout(() => {
                    setMessege({ flag: false, string: "" });
                }, 5000);
            }
            else {
                throw new Error(response.status)
            }
        }
        catch (e) {
            console.log(e);
            setExeption(true);
            setTimeout(() => {
                setExeption(false);
            }, 5000);
        }
    }

    async function deleteComment(id) {
        try {
            const response = await fetch(`http://localhost:3000/comments/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                let newArrComments = JSON.parse(localStorage.getItem(`commentsOf${postId}`));
                const commentToRemove = newArrComments.find((obj) => obj.id == id);
                newArrComments.splice(newArrComments.indexOf(commentToRemove), 1);
                localStorage.setItem(`commentsOf${postId}`, JSON.stringify(newArrComments));
                setComments([...newArrComments]);
                setMessege({ flag: true, string: "delete" });
                setTimeout(() => {
                    setMessege({ flag: false, string: "" });
                }, 5000);
            }
            else {
                throw new Error(response.status)
            }
        }
        catch (e) {
            console.log(e);
            setExeption(true);
            setTimeout(() => {
                setExeption(false);
            }, 5000);
        }
    }

    return (
        <>
            {exeption && <Exeption />}
            {messege.flag && <SuccessfulOperation messege={messege.string} />}
            {showDetailsWindow.flag && <EnterCommentDetails details={details} setDetails={setDetails} addComment={addComment} updateComment={updateComment} type={showDetailsWindow.type} setShowDetailsWindow={setShowDetailsWindow} />}
            {isLoading && <h1>Loading...</h1>}
            <button title="להוספת הערה" onClick={() => setShowDetailsWindow({ type: "add", flag: true })} >➕</button>
            <div className="comments">
                {comments && comments.map((comment, i) => {
                    return <Comment comment={comment} setDetails={setDetails} deleteComment={deleteComment} userEmail={userEmail} setShowDetailsWindow={setShowDetailsWindow} key={i} />
                }
                )}
                {comments && comments.length == 0 &&
                    <><h2>Sorry,</h2> <h3>There are no comments</h3>
                    </>}
            </div>
        </>
    )
}