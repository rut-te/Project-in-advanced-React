import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../css/Entrance.css'
import DefaultPage from '../DefaultPage';
import Exeption from "../Exeption";


export default function SignUp() {

    const [inputs, setInputs] = useState({});
    const [showMoreInfo, setShowMoreInfo] = useState(false);
    const [exeption, setExeption] = useState(false);
    const navigate = useNavigate();

    function onChangeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    function onBlurHandler(event) {
        let passwordIsVarify = true;
        if (event.target.checkValidity()) {
            if (event.target.name == "verify_password") {
                if (event.target.value != inputs.password) {
                    passwordIsVarify = false;
                }
                else {
                    passwordIsVarify = true;
                }
            }
            if (passwordIsVarify || event.target.name != "verify_password") {
                const name = event.target.name;
                const value = event.target.value;
                event.target.className = 'elementInForm';
                setInputs(values => ({ ...values, [name]: value }));
            }
            if (!passwordIsVarify) {
                event.target.className = 'invalidElementInForm';
            }
        }
        else {
            event.target.className = 'invalidElementInForm';
        }
    }

    async function onSubmitHandler(e) {
        e.preventDefault();
        if (inputs.password != inputs.verify_password) {
            alert("אימות סיסמא נכשל")
        }
        else {
            try {
                const response = await fetch(`http://localhost:3000/users?username=${inputs.username}&&website=${inputs.password}`);
                const data = await response.json();
                if (response.ok) {
                    if (data.length == 0) {
                        setShowMoreInfo(true);
                    } else {
                        alert("ארעה שגיאה ברשמה, נסה שוב או התחבר");
                    }
                }
                else {
                    throw new Error(response.status)
                }
            } catch (e) {
                console.log(e);
                setExeption(true);
                setTimeout(() => {
                    setExeption(false);
                }, 5000);
            }
        }
    }

    async function onSubmitInfoHandler(e) {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/users`, {
                method: 'POST',
                body: JSON.stringify(
                    {
                        name: inputs.name,
                        username: inputs.username,
                        email: inputs.email,
                        address: {
                            street: inputs.street,
                            suite: inputs.suite,
                            city: inputs.city,
                            zipcode: inputs.zipcode,
                            geo: {
                                lat: inputs.lat,
                                lng: inputs.lng
                            }
                        },
                        phone: inputs.phone,
                        website: inputs.password,
                        company: {
                            name: inputs.companyName,
                            catchPhrase: inputs.catchPhrase,
                            bs: inputs.bs
                        }

                    }
                ),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("userInfo", JSON.stringify(data));
                setInputs({});
                navigate(`/users/${data.id}/home`);
            }
            else {
                throw new Error(response.status)
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
                !showMoreInfo &&
                <form onSubmit={onSubmitHandler}>
                    <h1>SignUp</h1>
                    <h5>User Name:</h5>
                    <input className="elementInForm" name="username" value={inputs.username} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="First Name" minLength={2} maxLength={15} pattern="[a-zA-Z\s]*" required />
                    <h5>Password:</h5>
                    <input className="elementInForm" name="password" value={inputs.password} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="Password" minLength={2} required />
                    <h5>Verify Password:</h5>
                    <input className="elementInForm" name="verify_password" value={inputs.verify_password} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="Password" minLength={2} required />
                    <button type="submit" className='submit'>Submit</button>
                    <Link to="/login" className='specialLink'>Have account? Login</Link>
                </form>
            }
            {keys.length == 0 &&
                showMoreInfo &&
                <form onSubmit={onSubmitInfoHandler} className='moreInfo'>
                    <h1>Enter your details</h1>
                    <div className='details'>
                        <h5>Name:</h5>
                        <input className="elementInForm" name="name" value={inputs.name} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="name" minLength={2} required />
                        <h5>Email:</h5>
                        <input className="elementInForm" name="email" value={inputs.email} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="email" minLength={2} maxLength={15} pattern="[a-zA-Z\s]*" required />
                        <h5>Phone:</h5>
                        <input className="elementInForm" name="phone" value={inputs.phone} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="xxx-xxxxxxx" pattern="[0-9]{3}-[0-9]{7}" required />
                    </div>
                    <h3>Address</h3>
                    <div className='details'>
                        <h5>street:</h5>
                        <input className="elementInForm" name="street" value={inputs.street} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="street" minLength={2} required />
                        <h5>suite:</h5>
                        <input className="elementInForm" name="suite" value={inputs.suite} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="suite" minLength={2} required />
                        <h5>city:</h5>
                        <input className="elementInForm" name="city" value={inputs.city} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="city" minLength={2} required />
                    </div>
                    <h5>zipcode:</h5>
                    <input className="elementInForm" name="zipcode" value={inputs.zipcode} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="zipcode" minLength={1} required />
                    <h4>geo</h4>
                    <div className='details'>
                        <h5>lat:</h5>
                        <input className="elementInForm" name="lat" value={inputs.lat} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="lat" minLength={2} required />
                        <h5>lng:</h5>
                        <input className="elementInForm" name="lng" value={inputs.lng} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="lng" minLength={2} required />
                    </div>
                    <h3>company:</h3>
                    <div className='details'>
                        <h5>companyName:</h5>
                        <input className="elementInForm" name="companyName" value={inputs.companyName} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="companyName" minLength={2} required />
                        <h5>catchPhrase:</h5>
                        <input className="elementInForm" name="catchPhrase" value={inputs.catchPhrase} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="catchPhrase" minLength={2} required />
                        <h5>bs:</h5>
                        <input className="elementInForm" name="bs" value={inputs.bs} onBlur={onBlurHandler} onChange={(e) => onChangeHandler(e)} type="text" placeholder="bs" minLength={2} required />
                    </div>
                    <button type="submit" className='submit'>Submit</button>
                </form>

            }
            {
                keys.length != 0 && <DefaultPage string={"oops you are alredy login"} buttonToHome={true} />
            }
        </>
    )
}