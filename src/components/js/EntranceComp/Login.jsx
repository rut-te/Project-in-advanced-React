import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../css/Entrance.css'
import DefaultPage from '../DefaultPage';
import Exeption from "../Exeption";

export default function Login() {

    const [inputs, setInputs] = useState({});
    const [exeption, setExeption] = useState(false);
    const navigate = useNavigate();

    function onChangeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    function onBlurHandler(event) {
        if (event.target.checkValidity()) {
            const name = event.target.name;
            const value = event.target.value;
            event.target.className = 'elementInForm';
            setInputs(values => ({ ...values, [name]: value }))
        }
        else {
            event.target.className = 'invalidElementInForm';
        }
    }

    async function onSubmitHandler(e) {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/users?username=${inputs.username}&&website=${inputs.password}`);
            const data = await response.json();
            if (response.ok) {
                if (data.length > 0) {
                    localStorage.setItem("userInfo", JSON.stringify(data[0]));
                    setInputs({});
                    navigate(`/users/${data[0].id}/home`);
                } else {
                    alert("ארעה שגיאה בהתחברות, נסה שוב או הרשם");
                }
            }
            else {
                throw new Error(response.status);
            }
        } catch (e) {
            console.log(e);
            setExeption(true);
            setTimeout(() => {
                setExeption(false);
            }, 5000);
        }
    }

    const keys = Object.keys(localStorage);
    return (
        <>
            {exeption && <Exeption />}
            {keys.length == 0 &&
                <div>
                    <form onSubmit={onSubmitHandler}>
                        <h1>Login</h1>
                        <h5>User Name:</h5>
                        <input className="elementInForm" name="username" value={inputs.userName} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="First Name" minLength={2} maxLength={15} pattern="[a-zA-Z\s]*" required />
                        <h5>Password:</h5>
                        <input className="elementInForm" name="password" value={inputs.password} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="Password" required />
                        <button type="submit" className='submit'>Submit</button>
                        <Link to="/register" className='specialLink'>Dont have account? Register</Link>
                    </form>
                </div>}
            {
                keys.length != 0 && <DefaultPage string={"oops you are alredy login"} buttonToHome={true} />
            }
        </>
    )

}
