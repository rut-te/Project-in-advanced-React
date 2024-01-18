import '../../css/Home.css'

export default function Home() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return (
      <>
        
        <h1 className="userNameTitle">Hello {userInfo.name}</h1>
        <h2 className="openingString">We Happy To See You!</h2>
        <h2 className="openingString">you can start working😄</h2>
      </>
    )
  }
  