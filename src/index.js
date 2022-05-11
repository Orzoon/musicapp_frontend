import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { 
    BrowserRouter, 
    Routes, 
    Route } from 'react-router-dom';


// importing Components
import Login from './Components/Login';
import MainApp from './MainApp';
import Home from "./Components/Home"
import Search from "./Components/Search"
import YourLibrary from "./Components/YourLibrary"
import LikedSongs from "./Components/LikedSongs";
import PlaylistOutlet from './Components/PlaylistOutlet';
import Playlist from './Components/Playlist';

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <BrowserRouter>
        <Routes>
            <Route path = "/" element = {<Login/>}/>
            <Route path='/app' element= {<MainApp/>}>
                <Route path = 'home' element = {<Home/>}>
                    <Route path =":homeID" element = {<Home/>}/>
                </Route>
                <Route path = 'search' element = {<Search/>}/>
                <Route path = 'yourlibrary' element = {<YourLibrary/>}/>
                <Route path = 'playlist' element = {<PlaylistOutlet/>}>
                    <Route path =":playlistID" element = {<Playlist/>}/>
                </Route>
                <Route path = 'likedsongs' element = {<LikedSongs/>}/>
            
            </Route>
        </Routes>
    </BrowserRouter>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
