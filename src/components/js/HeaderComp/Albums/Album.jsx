import { useNavigate } from 'react-router-dom'

export default function Album({ albumDetails }) {

    const navigate = useNavigate();

    function openAlbum() {
        navigate(`${albumDetails.id}/photos`);
    }

    return (
        <div className='album'>
            <a className="albumTitle" onClick={openAlbum}>{albumDetails.title}</a>
            <h3 >{albumDetails.id}</h3>
        </div>
    )
}