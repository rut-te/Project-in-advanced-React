import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import Post from './Post'
import '../../../css/Post.css'
import EnterPostDetails from "./EnterPostDetails";
import Exeption from "../../Exeption.jsx";
import SuccessfulOperation from '../../SuccessfulOperation.jsx'

export default function Posts() {
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState();
    const [isActiveNow, setIsActiveNow] = useState("myPosts");
    const [search, setSearch] = useState();
    const [showDetailsWindow, setShowDetailsWindow] = useState({ type: "", flag: false });
    const [details, setDetails] = useState({});
    const [exeption, setExeption] = useState(false);
    const [messege, setMessege] = useState({ flag: false, string: "" });
    const { id } = useParams();

    useEffect(() => {
        setIsLoading(true);
        const postsArr = JSON.parse(localStorage.getItem("posts"));
        if (!postsArr) {
            getPosts();
        }
        else {
            setPosts(postsArr);
        }
        setIsLoading(false);
    }, []);

    async function getPosts() {
        try {
            const response = await fetch(`http://localhost:3000/posts?userId=${id}`);
            const resData = await response.json();
            if (response.ok) {
                localStorage.setItem("myPosts", JSON.stringify(resData));
                setPosts(resData);
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

    function whichPostsToShow(type) {
        if (type == "myPosts") {
            let newArrPosts = JSON.parse(localStorage.getItem("myPosts"));
            setPosts(newArrPosts);
        }
        if (type == "allPosts") {
            let newArrPosts = JSON.parse(localStorage.getItem("allPosts"));
            if (newArrPosts) { setPosts(newArrPosts); }
            else { getAllPosts() }
        }
    }

    async function getAllPosts() {

        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:3000/posts`);
            const resData = await response.json();
            if (response.ok) {
                let allPostsArr = resData.filter(post => post.userId != id);
                localStorage.setItem("allPosts", JSON.stringify(allPostsArr));
                setPosts(allPostsArr);

                setIsLoading(false);
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

    function searchPosts(string) {
        let newArrTodos = JSON.parse(localStorage.getItem(isActiveNow));
        newArrTodos = newArrTodos.filter(todo => (todo.title.includes(string) || todo.id == string))
        setPosts([...newArrTodos]);
    }

    async function addPost() {
        setShowDetailsWindow({ type: "", flag: false });
        try {
            const response = await fetch(`http://localhost:3000/posts`, {
                method: 'POST',
                body: JSON.stringify(
                    {
                        title: details.title,
                        body: details.body,
                        userId: id
                    }
                ),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (response.ok) {
                const resData = await response.json();
                let newArrPosts = JSON.parse(localStorage.getItem("myPosts"));
                newArrPosts.push(resData);
                localStorage.setItem("myPosts", JSON.stringify(newArrPosts));
                setPosts([...newArrPosts]);
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

    async function deletePost(id) {
        try {
            const response = await fetch(`http://localhost:3000/posts/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                let newArrPosts = JSON.parse(localStorage.getItem("myPosts"));
                const postToRemove = newArrPosts.find((obj) => obj.id == id);
                newArrPosts.splice(newArrPosts.indexOf(postToRemove), 1);
                localStorage.setItem("myPosts", JSON.stringify(newArrPosts));
                setPosts([...newArrPosts]);
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

    async function updatePost(id) {
        setShowDetailsWindow({ type: "", flag: false });
        let newDetails = { title: details.title };
        try {
            const response = await fetch(`http://localhost:3000/posts/${id}`, {
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
                const postToUpdate = newArrPosts.find((obj) => obj.id == id);
                newArrPosts[newArrPosts.indexOf(postToUpdate)].title = resData.title;
                details.body ? newArrPosts[newArrPosts.indexOf(postToUpdate)].body = resData.body : null;
                localStorage.setItem("myPosts", JSON.stringify(newArrPosts));
                setPosts([...newArrPosts]);
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

    function onChangeHandler(event) {
        const value = event.target.value;
        setSearch(value);
    }

    return (
        <>
            {exeption && <Exeption />}
            {messege.flag && <SuccessfulOperation messege={messege.string} />}
            {showDetailsWindow.flag && <EnterPostDetails details={details} setDetails={setDetails} addPost={addPost} updatePost={updatePost} setShowDetailsWindow={setShowDetailsWindow} type={showDetailsWindow.type} post={showDetailsWindow.post} />}
            <h1>My Posts</h1>
            <nav className="minNav">
                <button className={isActiveNow === "myPosts" ? "isActiveNow" : ""}
                    onClick={() => { setIsActiveNow("myPosts"); whichPostsToShow("myPosts") }}>My Posts  |</button>
                <button className={isActiveNow === "allPosts" ? "isActiveNow" : ""}
                    onClick={() => { setIsActiveNow("allPosts"); whichPostsToShow("allPosts") }}>All Posts</button>
            </nav>
            <div className="postsOperations">
                {isActiveNow == "myPosts" && <button id="addTask" title="להוספת פוסט" onClick={() => setShowDetailsWindow({ type: "add", flag: true })}>➕</button>}
                <input className="whatToSearch" placeholder="לחיפוש פוסט" maxLength="30" onChange={onChangeHandler}></input>
                <button title="לחיפוש" onClick={() => searchPosts(search)}>🔎</button>
            </div>
            {isLoading && <h1>Loading...</h1>}
            <div className="posts">
                {posts && posts.map((post, i) => {
                    return <Post postDetails={post} deletePost={deletePost} isActiveNow={isActiveNow} setShowDetailsWindow={setShowDetailsWindow} key={i} />
                }
                )}
                {posts && posts.length == 0 &&
                    <>
                        <h1>Sorry,</h1> <h3>We did not find what you were looking for</h3>
                    </>}
            </div>

        </>
    )
}