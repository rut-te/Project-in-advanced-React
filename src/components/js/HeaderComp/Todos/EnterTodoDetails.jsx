import '../../../css/EnterTodoDetails.css'

export default function EnterTodoDetails({ details, setDetails, addTodo, updateTodoTitle, type, setshowDetailsWindow, todo }) {

    function onChangeHandler(event) {
        const name = event.target.name;
        let value;
        if (name == "completed") { value = event.target.checked; }
        else { value = event.target.value; }
        setDetails(values => ({ ...values, [name]: value }));
    }

    function onSubmitInfoHandler() {
        if (type == "all") { addTodo() };
        if (type == "title") { updateTodoTitle(todo.id) };
        setDetails({});
    }

    return (
        <div className="backgroundDetailsWindow">
            <form onSubmit={onSubmitInfoHandler} className="detailsWindow">
                <button onClick={() => { setDetails({}); setshowDetailsWindow({ type: "", flag: false }) }}>❌</button>
                <h3>Enter Details:</h3>
                <h4>title:</h4>
                <input className="formElement" name="title" value={todo ? (details.title || todo.title) : details.title} onChange={(e) => onChangeHandler(e)} type="text" placeholder="title" required />
                {type == "all" &&
                    <div className="complated">
                        <h4>complated?</h4>
                        <input type="checkbox" className="isCompleted" name="completed" value={details.completed} onChange={(e) => onChangeHandler(e)} />
                    </div>
                }
                <button type="submit" className="submit">{type == "all" ? "Add" : "Update"}</button>
            </form>
        </div>
    )
}
