import React, {useContext, useEffect, useState,} from "react";
import {useNavigate} from "react-router-dom"
import { AppContext } from "../context";


// importing sscss
import "../styles/search.scss";


function ListItem({
    index,
    color,
    listItem
}){

const {id, name,href,image: imageURL} = listItem;
const navigate = useNavigate()
const [catLink, setCatLink] = useState(null);
useEffect(() => {
    if(name){
        if(name === "hiphop"){
            setCatLink("hip-hop")
        }
        else{
            setCatLink(name)
        }
    }
},[])

function searchClickHandler(e){
    navigate(`/app/home/${catLink}`)
}
return(<li 
        style = {{backgroundColor: color[index]}}
        onClick = {(e) => {searchClickHandler(e)}}
        >
            <h2 className = "S_LHeading">{name[0].toUpperCase() + name.slice(1)}</h2>
            <div className = "S_imageContainer">
                <img src={imageURL} alt = "#"/>
            </div>
        </li>)
}

export default function Search(){
    const {
        setNavOpen,
        search
    } = useContext(AppContext);
    // const searchCategoriesID = [
    //     "mood", 
    //     "rock", 
    //     "pop", 
    //     "chill", 
    //     "party", 
    //     "wellness", 
    //     "workout", 
    //     "hiphop", 
    //     "rnb", 
    //     "gaming"]
    const colorCode = [
            "#8D67AB", 
            "#E61E32", 
            "#8D67AB",
            "#477D95",
            "#AF2896",
            "#F037A5",
            "#777777",
            "#1E3264",
            "#DC148C",
            "#509BF5"] 
    useEffect(() => {
        setNavOpen(false)
    }, [])
    if(!search) return null
    return (
        <div className = "S_searchMainContainer">
            <h2 className = "S_catTitle">
                Browse All
            </h2>
            <ul className = "S_UL"> 
                { search && search.length > 0 &&
                    search.map((item, index) => {
                        return <ListItem 
                                key = {index}
                                index = {index}
                                listItem = {item}
                                color = {colorCode}
                        />
                    })


                }
            </ul>

        </div>
    )
}