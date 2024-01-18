import { Link, useNavigate, useParams } from 'react-router-dom'
import '../css/DefaultPage.css'

export default function DefaultPage({ string, changeUser = false }) {

    const navigate=useNavigate();
    let { id } = useParams();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!id) {

        userInfo ? id = userInfo.id : id = null;
    }
    return (
        <div className='defaultPage'>
            <h1 className='welcome'>{string}</h1>
            <div className='entrance'>
                {!changeUser && !userInfo && <Link to="/login">Login</Link>}
                {!changeUser && !userInfo && <Link to="/register">Sign Up</Link>}
                {!changeUser && userInfo && <Link to={`/users/${id}/home`}>Home</Link>}
                {changeUser && <button onClick={()=>logout(navigate)}>Change User</button>}
                {changeUser && <Link to={`/users/${userInfo.id}/home`}>Return Home</Link>}
            </div>
        </div>
    )
}

function logout(navigate) {
    localStorage.clear();
    navigate("/login");
}