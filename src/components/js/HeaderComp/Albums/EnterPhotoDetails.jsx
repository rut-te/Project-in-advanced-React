import '../../../css/EnterPhotoDetails.css'

export default function EnterPhotoDetails({ details, setDetails, addPhoto, updatePhoto, type, setShowDetailsWindow }) {

    function onChangeHandler(event) {
        const name = event.target.name;
        let value = event.target.value;;
        setDetails(values => ({ ...values, [name]: value }));
    }

    function onSubmitInfoHandler(e) {
        if (type == "addPhoto") { addPhoto() };
        if (type == "updatePhoto") { updatePhoto(details.id) };
        setDetails({});
    }

    return (
        <div className="backgroundDetailsPhotoWindow">
            <form onSubmit={onSubmitInfoHandler} className="detailsDetailsPhotoWindow">
                <button onClick={() => { setDetails({}); setShowDetailsWindow({ type: "", flag: false }) }}>❌</button>
                <h3 className='titleToEnterPhotoDetails'>Enter Details:</h3>
                <h4>title:</h4>
                <input className="formElement" name="title" value={details.title} onChange={(e) => onChangeHandler(e)} type="text" placeholder="title" required />
                <h4>url:</h4>
                <input className="formElement" name="url" value={details.url} onChange={(e) => onChangeHandler(e)} type="text" placeholder="title" required />
                <h4>thumbnailUrl:</h4>
                <input className="formElement" name="thumbnailUrl" value={details.thumbnailUrl} onChange={(e) => onChangeHandler(e)} type="text" placeholder="title" required />
                <button type="submit" className="submit">{type == "addPhoto" ? "Add" : "Update"}</button>
            </form>
        </div>
    )
}
