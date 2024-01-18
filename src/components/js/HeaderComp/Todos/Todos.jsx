import { useEffect, useState } from "react"
import Todo from "./Todo";
import { useParams } from "react-router-dom";
import EnterTodoDetails from './EnterTodoDetails'
import _ from "lodash"
import '../../../css/Todo.css'
import Exeption from "../../Exeption.jsx";
import SuccessfulOperation from '../../SuccessfulOperation.jsx'

export default function Todos() {

    const [todos, setTodos] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [showDetailsWindow, setshowDetailsWindow] = useState(false);
    const [orderTodos, setOrderTodos] = useState(false);
    const [details, setDetails] = useState({});
    const [search, setSearch] = useState();
    const [isActivet, setIsActivet] = useState("All");
    const [exeption, setExeption] = useState(false);
    const [messege, setMessege] = useState({ flag: false, string: "" });
    const { id } = useParams();

    useEffect(() => {
        setIsLoading(true);
        const todosArr = JSON.parse(localStorage.getItem("todos"));
        if (!todosArr) {
            getTodos();
        }
        else {
            setTodos(todosArr);
        }
        setIsLoading(false);
    }, []);

    async function getTodos() {
        try {
            const response = await fetch(`http://localhost:3000/todos?userId=${id}`);
            const resData = await response.json();
            if (response.ok) {
                localStorage.setItem("todos", JSON.stringify(resData));
                setTodos(resData);
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

    async function deleteTodo(id) {
        try {
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                let currentArrTodos = todos;
                let newArrTodos = JSON.parse(localStorage.getItem("todos"));
                const todoToRemove = newArrTodos.find((obj) => obj.id == id);
                newArrTodos.splice(newArrTodos.indexOf(todoToRemove), 1);
                const currentTodoToRemove = currentArrTodos.find((obj) => obj.id == id);
                currentArrTodos.splice(currentArrTodos.indexOf(currentTodoToRemove), 1);
                localStorage.setItem("todos", JSON.stringify(newArrTodos));
                setTodos([...currentArrTodos]);
                setMessege({ flag: true, string: "delete" });
                setTimeout(() => {
                    setMessege({ flag: false, string: "" });
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

    async function updateTodoStatus(id, updatedComp) {
        try {
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    completed: updatedComp,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });

            if (response.ok) {
                let currentArrTodos = todos;
                let newArrTodos = JSON.parse(localStorage.getItem("todos"));
                const todoToUpdate = newArrTodos.find((obj) => obj.id == id);
                let status = newArrTodos[newArrTodos.indexOf(todoToUpdate)].completed;
                newArrTodos[newArrTodos.indexOf(todoToUpdate)].completed = !status;
                localStorage.setItem("todos", JSON.stringify(newArrTodos));
                const currentTodoToUpdate = currentArrTodos.find((obj) => obj.id == id);
                currentArrTodos[currentArrTodos.indexOf(currentTodoToUpdate)].completed = !status;
                setTodos([...currentArrTodos]);
                searchTodos(isActivet);
                setMessege({ flag: true, string: "update" });
                setTimeout(() => {
                    setMessege({ flag: false, string: "" });
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

    async function updateTodoTitle(id) {
        setshowDetailsWindow({ type: "", flag: false });
        try {
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    title: details.title,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (response.ok) {
                let currentArrTodos = todos;
                let newArrTodos = JSON.parse(localStorage.getItem("todos"));
                const todoToUpdate = newArrTodos.find((obj) => obj.id == id);
                newArrTodos[newArrTodos.indexOf(todoToUpdate)].title = details.title;
                localStorage.setItem("todos", JSON.stringify(newArrTodos));
                const currentTodoToUpdate = currentArrTodos.find((obj) => obj.id == id);
                currentArrTodos[currentArrTodos.indexOf(currentTodoToUpdate)].title = details.title;
                setTodos([...currentArrTodos]);
                setMessege({ flag: true, string: "update" });
                setTimeout(() => {
                    setMessege({ flag: false, string: "" });
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

    async function addTodo() {
        setshowDetailsWindow({ type: "", flag: false });
        try {
            const response = await fetch(`http://localhost:3000/todos`, {
                method: 'POST',
                body: JSON.stringify(
                    {
                        userId: id,
                        title: details.title,
                        completed: details.completed ? true : false,
                    }
                ),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (response.ok) {
                const resData = await response.json();
                let newArrTodos = JSON.parse(localStorage.getItem("todos"));
                newArrTodos.push(resData);
                localStorage.setItem("todos", JSON.stringify(newArrTodos));
                newArrTodos.sort((a, b) => a.id - b.id);
                setIsActivet("All")
                setTodos([...newArrTodos]);
                setMessege({ flag: true, string: "addition" });
                setTimeout(() => {
                    setMessege({ flag: false, string: "" });
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

    const sortHandleChange = (e) => {
        let newArrTodos = JSON.parse(localStorage.getItem("todos"));
        setOrderTodos(false)
        switch (e.target.value) {
            case "סדרתי":
                newArrTodos.sort((a, b) => a.id - b.id);
                break;
            case "אלפביתי":
                newArrTodos.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "ביצוע":
                newArrTodos.sort((a, b) => a.completed - b.completed);
                break;
            case "אקראי":
                newArrTodos = _.shuffle(newArrTodos);
                break;
        }
        setTodos([...newArrTodos]);
    };

    function searchTodos(type, string) {
        let newArrTodos = JSON.parse(localStorage.getItem("todos"));
        switch (type) {
            case "All":
                break;
            case "Done":
                newArrTodos = newArrTodos.filter(todo => todo.completed == true)
                break;
            case "Done't":
                newArrTodos = newArrTodos.filter(todo => todo.completed == false)
                break;
            case "stringOrId":
                newArrTodos = newArrTodos.filter(todo => (todo.title.includes(string) || todo.id == string))
                break;
        }
        setTodos([...newArrTodos]);
    }

    function onChangeHandler(event) {
        const value = event.target.value;
        setSearch(value);
    }

    return (
        <>
            {exeption && <Exeption />}
            {messege.flag && <SuccessfulOperation messege={messege.string} />}
            {showDetailsWindow.flag && <EnterTodoDetails details={details} setDetails={setDetails} type={showDetailsWindow.type} todo={showDetailsWindow.todo} id={showDetailsWindow.id} addTodo={addTodo} updateTodoTitle={updateTodoTitle} setshowDetailsWindow={setshowDetailsWindow} />}
            <h1>My Todos</h1>
            <div className="todosOperations">
                <button id="addTask" title="להוספת מטלה" onClick={() => setshowDetailsWindow({ type: "all", flag: true })}>➕</button>
                <button id="sendToOrder" title="למיון" onClick={() => setOrderTodos(true)}>🔃</button>
                <input className="whatToSearch" placeholder="לחיפוש מטלה" maxLength="30" onChange={onChangeHandler}></input>
                <button title="לחיפוש" onClick={() => searchTodos("stringOrId", search)}>🔎</button>
                <div className="orderByDone">
                    <button className={isActivet === "All" ? "isActive" : "sendToSearch"}
                        title="All" onClick={() => { setIsActivet("All"); searchTodos("All") }}>All |</button>
                    <button className={isActivet === "Done" ? "isActive" : "sendToSearch"}
                        title="Done" onClick={() => { setIsActivet("Done"); searchTodos("Done") }} >Done |</button>
                    <button className={isActivet === "Done't" ? "isActive" : "sendToSearch"}
                        title="Done't" onClick={() => { setIsActivet("Done't"); searchTodos("Done't") }}>Not Done</button>
                </div>
            </div>
            <div>
                {orderTodos && <select name="mySelect" onChange={sortHandleChange}>
                    <option value="סדרתי">סדרתי</option>
                    <option value="אלפביתי">אלפביתי</option>
                    <option value="ביצוע">ביצוע</option>
                    <option value="אקראי">אקראי</option>
                </select>}
            </div>
            {isLoading && <h1>Loading...</h1>}
            <div className="todos">
                {todos && todos.map((todo, i) => {
                    return <Todo todo={todo} key={todo.id} deleteTodo={deleteTodo} updateTodoStatus={updateTodoStatus} setshowDetailsWindow={setshowDetailsWindow} />
                }
                )}
                {todos && todos.length == 0 &&
                    <><h1>Sorry,</h1> <h3>We did not find what you were looking for</h3>
                    </>}
            </div>

        </>
    )
}
