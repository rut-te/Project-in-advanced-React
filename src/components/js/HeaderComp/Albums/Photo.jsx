import { useNavigate } from 'react-router-dom'
import '../../../css/Album.css'

export default function Photo({ photoDetails, deletePhoto, setDetails, setShowDetailsWindow }) {

    const navigate = useNavigate();

    function openPhoto() {
        navigate(`${photoDetails.id}`);
    }

    return (
        <>
            <h4 className="photoTitle">{photoDetails.title}</h4>
            <button onClick={() => { setDetails(photoDetails); setShowDetailsWindow({ type: "updatePhoto", flag: true }) }}>🖊</button>
            <button onClick={() => deletePhoto(photoDetails.id)}>🗑</button>
            <img src={photoDetails.thumbnailUrl} onClick={openPhoto} />
        </>
    )

}