import '../../../css/EnterCommentDetails.css'

export default function EnterPostDetails({ details, setDetails, addComment, updateComment, type, setShowDetailsWindow }) {

    function onChangeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;
        setDetails(values => ({ ...values, [name]: value }));
    }

    function onSubmitInfoHandler(e) {
        if (type == "add") { addComment() }
        if (type == "update") { updateComment(details.id) }
        setDetails({});
    };

    return (
        <div className="backgroundCommentDetailsWindow">
            <form onSubmit={onSubmitInfoHandler} className="detailsCommentWindow">
                <button onClick={() => { setDetails({}); setShowDetailsWindow({ type: "", flag: false }) }}>❌</button>
                <h3 className="enterDetails">Enter Comment:</h3>
                <textarea className="textareaFormElement" name="body" value={details.body}
                    onChange={(e) => onChangeHandler(e)} type="text" placeholder="body" required />
                <button type="submit" className="submit">{type == "add" ? "Add" : "Update"}</button>
            </form>
        </div>
    )
}
