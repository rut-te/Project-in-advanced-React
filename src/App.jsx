import './App.css'
import Home from './components/js/HeaderComp/Home';
import { Routes, Route } from 'react-router-dom';
import DefaultPage from './components/js/DefaultPage';
import Login from './components/js/EntranceComp/Login';
import SignUp from './components/js/EntranceComp/SignUp';
import Layout from './components/js/Layout'
import Todos from './components/js/HeaderComp/Todos/Todos'
import Posts from './components/js/HeaderComp/Posts/Posts'
import Albums from './components/js/HeaderComp/Albums/Albums';
import Photos from './components/js/HeaderComp/Albums/Photos';
import BigPhoto from './components/js/HeaderComp/Albums/BigPhoto';
import BodyPost from './components/js/HeaderComp/Posts/BodyPost';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<DefaultPage string={"welcom🥳"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/users/:id/home" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="todos" element={<Todos />} />
          <Route path="posts" >
            <Route index element={<Posts />} />
            <Route path=":postId" element={<BodyPost />} />
          </Route>
          <Route path="albums">
            <Route index element={<Albums />} />
            <Route path=":albumId/photos" >
              <Route index element={<Photos />} />
              <Route path=":photoId" element={<BigPhoto />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<DefaultPage string={"oops the page you want arn't found😚"} />} />
      </Routes >

    </>
  )
}

export default App
