import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import Comments from './Comments.jsx';
import EnterPostDetails from './EnterPostDetails.jsx';
import '../../../css/Post.css'
import Exeption from "../../Exeption.jsx";
import SuccessfulOperation from '../../SuccessfulOperation.jsx'

export default function BodyPost() {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [post, setPost] = useState();
    const [isActiveNow, setIsActiveNow] = useState();
    const [showComments, setShowComments] = useState(false);
    const [showDetailsWindow, setShowDetailsWindow] = useState({ type: "", flag: false });
    const [details, setDetails] = useState({});
    const [exeption, setExeption] = useState(false);
    const [messege, setMessege] = useState({ flag: false, string: "" });
    const { postId } = useParams();

    useEffect(() => {
        setIsLoading(true);
        getPost();
        setIsLoading(false);
    }, []);

    function getPost() {
        const myPostsArr = JSON.parse(localStorage.getItem("myPosts"));
        const currentPost = myPostsArr.find((obj) => obj.id == postId);
        if (currentPost) { setPost({ ...currentPost }); setIsActiveNow("myPosts"); }
        else {
            const allPostsArr = JSON.parse(localStorage.getItem("allPosts"));
            const currentPost = allPostsArr.find((obj) => obj.id == postId);
            setPost({ ...currentPost });
            setIsActiveNow("allPost");
        }
    }

    async function deletePost() {
        try {
            const response = await fetch(`http://localhost:3000/posts/${post.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                let newArrPosts = JSON.parse(localStorage.getItem(isActiveNow));
                const postToRemove = newArrPosts.find((obj) => obj.id == post.id);
                newArrPosts.splice(newArrPosts.indexOf(postToRemove), 1);
                localStorage.setItem(isActiveNow, JSON.stringify(newArrPosts));
                navigate("..");
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

    async function updatePost() {
        setShowDetailsWindow({ type: "", flag: false });
        let newDetails = { title: details.title, body: details.body };
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    ...newDetails,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (response.ok) {
                const resData = await response.json();
                let newArrPosts = JSON.parse(localStorage.getItem("myPosts"));
                const postToUpdate = newArrPosts.find((obj) => obj.id == resData.id);
                newArrPosts[newArrPosts.indexOf(postToUpdate)].title = resData.title;
                details.body ? newArrPosts[newArrPosts.indexOf(postToUpdate)].body = resData.body : null;
                localStorage.setItem("myPosts", JSON.stringify(newArrPosts));
                setPost(resData);
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

    return (
        <>
            {exeption && <Exeption />}
            {messege.flag && <SuccessfulOperation messege={messege.string} />}
            {showDetailsWindow.flag && <EnterPostDetails details={details} setDetails={setDetails} updateAllPost={updatePost} setShowDetailsWindow={setShowDetailsWindow} type={"updateAll"} />}
            <div>
                <button className='closeBodyPost' onClick={() => navigate("..")}>❌</button>
            </div>
            {isLoading && <h3>Loading...</h3>}
            {isActiveNow == "myPosts" && <>
                <button onClick={() => { console.log(post); setDetails(post); setShowDetailsWindow({ type: "updateAll", flag: true }) }}>🖊</button>
                <button onClick={deletePost}>🗑</button>
            </>
            }
            {post && <>
                <div className="bodyOfPost">
                    <h2 className="idOfBodyPost">post id: {post.id}</h2>
                    <h2 className='titleToBodyPost'>{post.title}</h2>
                    <h3 className='bodyPost'>{post.body}</h3>
                    <button title="Click Me" className="toComments" onClick={() => setShowComments(show => !show)}>
                        {showComments == false ? "Show Comments" : "Close Comments"}
                    </button>
                    {showComments && <Comments postId={post.id} />}
                </div>
            </>}

        </>
    )
}