
export default function EnterAlbumDetails({ details, setDetails, addAlbum, type, setShowDetailsWindow }) {

    function onChangeHandler(event) {
        const name = event.target.name;
        let value = event.target.value;;
        setDetails(values => ({ ...values, [name]: value }));
    }

    function onSubmitInfoHandler(e) {
        if (type == "addAlbum") { addAlbum() };
        setDetails({});
    }

    return (
        <div className="backgroundDetailsWindow">
            <form onSubmit={onSubmitInfoHandler} className="detailsWindow">
                <button onClick={() => { setDetails({}); setShowDetailsWindow({ type: "", flag: false }) }}>❌</button>
                <h3>Enter Details:</h3>
                <h4>title:</h4>
                <input className="formElement" name="title" value={details.title} onChange={(e) => onChangeHandler(e)} type="text" placeholder="title" required />
                <button type="submit" className="submit">{type == "addAlbum" ? "Add" : "Update"}</button>
            </form>
        </div>
    )
}
