import { useEffect, useState } from "react";
import Album from "./Album";
import { useParams } from "react-router-dom";
import EnterAlbumDetails from "./EnterAlbumDetails.jsx";
import '../../../css/Album.css'
import Exeption from "../../Exeption.jsx";
import SuccessfulOperation from '../../SuccessfulOperation.jsx'


export default function Albums() {

    const [isLoading, setIsLoading] = useState(false);
    const [albums, setAlbums] = useState();
    const [search, setSearch] = useState();
    const [showDetailsWindow, setShowDetailsWindow] = useState({ type: "", flag: false });
    const [details, setDetails] = useState({});
    const [exeption, setExeption] = useState(false);
    const [messege, setMessege] = useState({flag:false, string:""});
    const { id } = useParams();


    useEffect(() => {
        setIsLoading(true);
        const albumsArr = JSON.parse(localStorage.getItem("albums"));
        if (!albumsArr) {
            getAlbums();
        }
        else {
            setAlbums(albumsArr);
        }
        setIsLoading(false);
    }, []);

    async function getAlbums() {
        try {
            const response = await fetch(`http://localhost:3000/albums?userId=${id}`);
            const resData = await response.json();
            if (response.ok) {
                localStorage.setItem("albums", JSON.stringify(resData));
                setAlbums(resData);
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

    function searchAlbums(string) {
        let newArrAlbums = JSON.parse(localStorage.getItem("albums"));
        newArrAlbums = newArrAlbums.filter(album => (album.title.includes(string) || album.id == string))
        setAlbums([...newArrAlbums]);
    }

    async function addAlbum() {
        setShowDetailsWindow({ type: "", flag: false });
        try {
            const response = await fetch(`http://localhost:3000/albums`, {
                method: 'POST',
                body: JSON.stringify(
                    {
                        title: details.title,
                        userId: id
                    }
                ),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (response.ok) {
                const resData = await response.json();
                let newArrAlbums = JSON.parse(localStorage.getItem("albums"));
                newArrAlbums.push(resData);
                localStorage.setItem("albums", JSON.stringify(newArrAlbums));
                setAlbums([...newArrAlbums]);
                setMessege({flag:true, string:"addition"});
                setTimeout(() => {
                    setMessege({flag:false, string:""});
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
            {showDetailsWindow.flag && <EnterAlbumDetails details={details} setDetails={setDetails} addAlbum={addAlbum} setShowDetailsWindow={setShowDetailsWindow} type={showDetailsWindow.type} />}
            <h1>My Albums</h1>
            <div className="albumsOperations">
                <button title="להוספת אלבום" onClick={() => setShowDetailsWindow({ type: "addAlbum", flag: true })}>➕</button>
                <input className="whatToSearch" placeholder="לחיפוש אלבום" maxLength="30" onChange={onChangeHandler}></input>
                <button title="לחיפוש" onClick={() => searchAlbums(search)}>🔎</button>
            </div>
            {isLoading && <h1>Loading...</h1>}
            <div className="albums">
                {albums && albums.map((album, i) => {
                    return <Album albumDetails={album} key={i} />
                }
                )}
                {albums && albums.length == 0 &&
                    <>
                        <h1>Sorry,</h1> <h3>We did not find what you were looking for</h3>
                    </>}
            </div>
        </>
    )
}