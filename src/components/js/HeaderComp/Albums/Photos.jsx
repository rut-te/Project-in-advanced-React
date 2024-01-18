import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Photo from "./Photo";
import '../../../css/Album.css'
import EnterPhotoDetails from './EnterPhotoDetails';
import Exeption from "../../Exeption.jsx";
import SuccessfulOperation from '../../SuccessfulOperation.jsx'


export default function Photos() {

    const { albumId } = useParams();
    const [photos, setPhotos] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [showDetailsWindow, setShowDetailsWindow] = useState({ type: "", flag: false });
    const [details, setDetails] = useState({});
    const [currentPage, setCurrentPage] = useState(2);
    const [exeption, setExeption] = useState(false);
    const [messege, setMessege] = useState({ flag: false, string: "" });
    const navigate = useNavigate();
    const limit=6;

    useEffect(() => {
        setIsLoading(true);
        const photosArr = JSON.parse(localStorage.getItem(`album${albumId}`));
        if (!photosArr) {
            getFirstPhotos();
        }
        else {
            const firstPhotosArr = photosArr.slice(0, 6);
            setPhotos(firstPhotosArr);
        }
        setIsLoading(false);
    }, []);

    async function getFirstPhotos() {
        const response = await fetch(`http://localhost:3000/photos?albumId=${albumId}&_start=0&_limit=6`);
        const resData = await response.json();
        localStorage.setItem(`album${albumId}`, JSON.stringify(resData));
        setPhotos(resData);
    }

    async function getPhotos() {
        const arrPhotos = JSON.parse(localStorage.getItem(`album${albumId}`));
        setCurrentPage(page => page + 1);
        if (arrPhotos) {
            if (arrPhotos.length >= currentPage * 6) {
                const newArrPhotos = arrPhotos.slice(0, currentPage * 6);
                setPhotos(newArrPhotos);
            }
            else {
                const response = await fetch(`http://localhost:3000/photos?albumId=${albumId}&_start=${arrPhotos.length}&_limit=${limit}`);
                const resData = await response.json();
                const newPhotosArr = arrPhotos.concat(resData);
                localStorage.setItem(`album${albumId}`, JSON.stringify(newPhotosArr));
                setPhotos(newPhotosArr);
            }
        }
    }

    async function deletePhoto(id) {
        try {
            const response = await fetch(`http://localhost:3000/photos/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                let newArrPhotos = JSON.parse(localStorage.getItem(`album${albumId}`));
                const photoToRemove = newArrPhotos.find((obj) => obj.id == id);
                newArrPhotos.splice(newArrPhotos.indexOf(photoToRemove), 1);
                localStorage.setItem(`album${albumId}`, JSON.stringify(newArrPhotos));
                if (newArrPhotos.length >= currentPage * 6) {
                    newArrPhotos = newArrPhotos.slice(0, (currentPage - 1) * 6);
                    setPhotos(newArrPhotos);
                    setMessege({ flag: true, string: "delete" });
                    setTimeout(() => {
                        setMessege({ flag: false, string: "" });
                    }, 5000);
                }
                else {
                    const response = await fetch(`http://localhost:3000/photos?albumId=${albumId}&_start=${newArrPhotos.length}&_limit=1`);
                    const resData = await response.json();
                    const arrPhotos = newArrPhotos.concat(resData);
                    localStorage.setItem(`album${albumId}`, JSON.stringify(arrPhotos));
                    setPhotos(arrPhotos);
                    setMessege({ flag: true, string: "delete" });
                    setTimeout(() => {
                        setMessege({ flag: false, string: "" });
                    }, 5000);
                }
            }
        }
        catch (e) {
            alert(e);
        }
    }

    async function updatePhoto(id) {
        setShowDetailsWindow({ type: "", flag: false });
        try {
            const response = await fetch(`http://localhost:3000/photos/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    title: details.title,
                    url: details.url ? details.url : null,
                    thumbnailUrl: details.thumbnailUrl
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (response.ok) {
                const resData = await response.json();
                let newArrPhotos = JSON.parse(localStorage.getItem(`album${albumId}`));
                const postToUpdate = newArrPhotos.find((obj) => obj.id == id);
                newArrPhotos[newArrPhotos.indexOf(postToUpdate)].title = resData.title;
                newArrPhotos[newArrPhotos.indexOf(postToUpdate)].url = resData.url;
                newArrPhotos[newArrPhotos.indexOf(postToUpdate)].thumbnailUrl = resData.thumbnailUrl;
                localStorage.setItem(`album${albumId}`, JSON.stringify(newArrPhotos));
                setPhotos([...newArrPhotos]);
                setMessege({ flag: true, string: "update" });
                setTimeout(() => {
                    setMessege({ flag: false, string: "" });
                }, 5000);
            }
        }
        catch (e) {
            alert(e);
        }
    }

    async function addPhoto() {
        setShowDetailsWindow({ type: "", flag: false });
        try {
            const response = await fetch(`http://localhost:3000/photos`, {
                method: 'POST',
                body: JSON.stringify(
                    {
                        albumId: albumId,
                        title: details.title,
                        url: details.url ? details.url : null,
                        thumbnailUrl: details.thumbnailUrl
                    }
                ),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (response.ok) {
                const resData = await response.json();
                let newArrPhotos = JSON.parse(localStorage.getItem(`album${albumId}`));
                newArrPhotos.push(resData);
                localStorage.setItem(`album${albumId}`, JSON.stringify(newArrPhotos));
                setMessege({ flag: true, string: "addition" });
                setTimeout(() => {
                    setMessege({ flag: false, string: "" });
                }, 5000);
            }
            else {
                throw new Error(response.status);
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
            {showDetailsWindow.flag && <EnterPhotoDetails details={details} setDetails={setDetails} updatePhoto={updatePhoto} addPhoto={addPhoto} setShowDetailsWindow={setShowDetailsWindow} type={showDetailsWindow.type} />}
            {isLoading && <h1>Loading...</h1>}
            <button title="Close Album" onClick={() => navigate("..")}>❌</button>
            <div>
                <h2 className="albumId">Album number {albumId}</h2>
                <button title="להוספת תמונה" onClick={() => setShowDetailsWindow({ type: "addPhoto", flag: true })}>➕</button>
            </div>
            <div className="photos">
                {photos && photos.map((photo, i) => {
                    return <Photo photoDetails={photo} deletePhoto={deletePhoto} setDetails={setDetails} setShowDetailsWindow={setShowDetailsWindow} key={i} />
                }
                )}
                {photos && photos.length == 0 &&
                    <><h1>Sorry,</h1> <h3>There are no photos in your album😓</h3>
                    </>}
            </div>
            {photos && photos.length > 0 &&
                <button className="showMore" title="Show More" onClick={() => { getPhotos(); }}>Show More</button>
            }
        </>
    )
}