import '../css/Nav.css'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import Info from './HeaderComp/Info'


export default function Header() {
    const [showInfo, setShowInfo] = useState(false);
    const [onHomePage, setOnHomePage] = useState();
    const navigate = useNavigate();
    const { id } = useParams();
    return (
        <>
            <nav>
                <button className='logout' onClick={() => { logout(navigate)}}>Logout</button>
                <NavLink to="todos" className={({ isActive }) => isActive ? "active" : null}
                    onClick={() => setOnHomePage(false)}>Todos</NavLink>
                <NavLink to="posts" className={({ isActive }) => isActive ? "active" : null}
                    onClick={() => setOnHomePage(false)}>Posts</NavLink>
                <NavLink to="albums" className={({ isActive }) => isActive ? "active" : null}
                    onClick={() => setOnHomePage(false)}>Albums</NavLink>
                <NavLink onClick={() => {setShowInfo(last => !last) }}
                    className={({ isActive }) => isActive && showInfo ? "active" : null}>Info</NavLink>
                {showInfo && <Info setShowInfo={setShowInfo} />}
                <NavLink to={`/users/${id}/home`}
                    className={({ isActive }) => isActive && onHomePage ? "active" : null}
                    onClick={() => setOnHomePage(true)}> Home</NavLink>
            </nav >
        </>
    )
}

function logout(navigate) {
    localStorage.clear();
    navigate("/");
}