import '../../../css/EnterPostDetails.css'

export default function EnterPostDetails({ details, setDetails, addPost,updatePost,updateAllPost, setShowDetailsWindow,type,post}) {

    function onChangeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;
        setDetails(values => ({ ...values, [name]: value }));
    }

    function onSubmitInfoHandler(e) {
        if(type=="add"){addPost()}
        if(type=="updateTitle"){updatePost(post.id)}
        if(type=="updateAll"){updateAllPost()}
        setDetails({});
    };

    return (
        
        <div className="backgroundPostDetailsWindow">
            <form onSubmit={onSubmitInfoHandler} className="detailsPostWindow">
                <button onClick={() => { setDetails({}); setShowDetailsWindow( {type: "", flag: false }) }}>❌</button>
                <h3 className="enterDetails">Enter Details:</h3>
                <h4 className="titles">title:</h4>
                <input className="inputFormElement" name="title" value={post?(details.title||post.title):details.title} onChange={(e) => onChangeHandler(e)} type="text" placeholder="title" required />
                {type!="updateTitle"&&<><h4 className="titles">body:</h4>
                <textarea className="textareaFormElement" name="body" value={(post&&post.body)?(details.body||post.body):details.body} onChange={(e) => onChangeHandler(e)} type="text" placeholder="body" required /></>}
                <button type="submit" className="submit">{type=="add"?"Add":"Update"}</button>
            </form>
        </div>
    )
}
