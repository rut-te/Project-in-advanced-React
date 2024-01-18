import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

export default function Photo() {

    const { albumId, photoId } = useParams();
    const [photo, setPhoto] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        getPhotos();
        setIsLoading(false);
    }, []);

    async function getPhotos() {
        const photosArr = JSON.parse(localStorage.getItem(`album${albumId}`));
        const currentPhoto = photosArr.find((obj) => obj.id == photoId)
        setPhoto(currentPhoto.url)
    }

    return (
        <>
            {isLoading && <h2>Loading...</h2>}
            <div>
                <button onClick={() => navigate("..")}>❌</button>
            </div>
            <img src={`${photo}`} />

        </>
    )

}