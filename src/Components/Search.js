import React, {useContext, useEffect, useState,} from "react";
import {useNavigate} from "react-router-dom"
import { AppContext } from "../context";
import {spotifyApi} from "../helper";


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
        setCatLink(name)
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
        home
    } = useContext(AppContext);
    const searchCategoriesID = [
        "mood", 
        "rock", 
        "pop", 
        "chill", 
        "party", 
        "wellness", 
        "workout", 
        "hiphop", 
        "rnb", 
        "gaming"]
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
    const [searchList, setSearchList] = useState(null);

    useEffect(() => {
            spotifyApi.getCategories({limit: 50})
            .then(_data => {
                    if(!_data){
                        throw new Error("_no Data")
                    }
                    const _array = _data.categories.items;
                    const _FilteredArray = _array.reduce((accumulator, item, index) => {
                        const includes =  searchCategoriesID.includes(item.id)
                        if(includes){
                                   accumulator = [...accumulator,{
                                       id: item.id,
                                       name: item.id,
                                       href: item.href,
                                       image: item.icons[0].url
                                   }]
                            }

                            return accumulator
                    }, [])  
                    

                    // setting the value 
                    setSearchList(_FilteredArray)
                })
            .catch(error => {
            // later on
        })
    }, [])
    return (
        <div className = "S_searchMainContainer">
            <h2 className = "S_catTitle">
                Browse All
            </h2>
            <ul className = "S_UL"> 
                { searchList && searchList.length > 0 &&
                    searchList.map((item, index) => {
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