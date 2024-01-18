import '../../css/Info.css'

export default function Info({setShowInfo}) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
     console.log(userInfo);
    return (
        <div className="info">
            <button onClick={()=>setShowInfo(false)}>❌</button>
            <h3>Hello {userInfo.name}</h3>
            <h4>Email: </h4> 
            <h5>{userInfo.email}</h5>
            <h4>Phone: </h4>
            <h5>{userInfo.phone}</h5>
            <h4>Address:</h4>
            <h5>Street: <br/>{userInfo.address.street}</h5>
            <h5>Suite: <br/>{userInfo.address.suite}</h5>
            <h5>City: <br/>{userInfo.address.city}</h5>
            <h5>Zipcode: <br/>{userInfo.address.zipcode}</h5>
            <h4>Company:</h4>
            <h5>Name: <br/>{userInfo.company.name}</h5>
            <h5>CatchPhrase: <br/>{userInfo.company.catchPhrase}</h5>
            <h5>Bs: <br/>{userInfo.company.bs}</h5>
        </div>
    )
}