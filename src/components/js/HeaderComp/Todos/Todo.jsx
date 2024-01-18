import '../../../css/Todo.css'
import { useState } from 'react';

export default function Todo({ todo, deleteTodo, updateTodoStatus, setshowDetailsWindow }) {
    const [checked, setChecked] = useState(todo.completed);
    return (
        <div className="todo">
            <button onClick={() => setshowDetailsWindow({ type: "title", flag: true, todo: todo })}>🖊</button>
            <button onClick={() => deleteTodo(todo.id)}>🗑</button>
            <h5 className='title'>{todo.title}</h5>
            <input type="checkbox" checked={checked} className='completed' onChange={(e) => { setChecked(e.target.checked); updateTodoStatus(todo.id, !todo.completed) }} />
            <button className='idOfTodo'>{todo.id}</button>
        </div>
    )
}