import React, {useContext, useEffect, useState} from "react";
import {useParams, useNavigate, Navigate} from "react-router-dom"
import { AppContext } from "../context";

//hooks
import {useWindowWidthResize} from "../hooks"
// importing subHome components
import { CommonHomeCard, IndCard } from "../subComponents/subHome";
// importing stylesheet
import "../styles/Home.scss"

export default function Home(){
    const {homeID} = useParams(null);
    const navigate = useNavigate();
    const homeIDS = ["mood","freshnewmusic","workout","chill", "pop", "hip-hop", "wellness", "party", "rock"]
    const {windowWidth} = useWindowWidthResize()
    const {setNavOpen,home: homeData} = useContext(AppContext)
    const [homeDataCopy, setHomeDataCopy] = useState(null);
    const [indCat, setIndCat] = useState(null);
    const [indData, setIndData] = useState(null);
    const [showPlayHomeBtn, setShowPlayHomeBtn] = useState(true);

    useEffect(() => {
        setNavOpen(false)
        if(homeData){
            //checking the width
            const widthsArr = [320,480,580,768,992,1200,1400];//number
            const itemsToReturn = [2,2,3,3,4,5,6]//number
            //returning the length 
            const size = widthsArr.reduce((accumulator, currentItem, currentIndex) => {
                
                if(windowWidth >= currentItem){
                    accumulator = [currentItem, currentIndex]
                }
                return accumulator 
            }, [320, 0])
            /* SIZE Array --> screenValue, index===setToitemsToReturn */
            const slicedHomeData = homeData.map((dataObj, index) => {
                const tracksSliced = dataObj.tracks.slice(0, itemsToReturn[size[1]])
                return {...dataObj, tracks: tracksSliced}
            })
            if(windowWidth >= 768){
                setShowPlayHomeBtn(true)
            }else {
                setShowPlayHomeBtn(false)
            }
            if(!homeID) setIndCat(false)
            setHomeDataCopy(slicedHomeData)
        }


    }, [windowWidth, homeData, homeID]);

    //---> for params
    useEffect(() => {
        if(homeID){
            const contains = homeIDS.includes(homeID)
            if(!contains){
                setIndCat(false);
                setIndData(null)
                navigate("/app/home", {replace: true})
                return
            }
            const filteredIndData = homeData.filter((homeObj, index) => {
                const _title = homeObj.hometitle.split(" ").join("").toLowerCase();
                return homeID === _title
            }) 
        
            setIndData(filteredIndData)
            setIndCat(true)
            window.scrollTo(0,0,)
        }
    }, [homeID, homeData])


    if(!homeData) return; 
    //if(!homeDataCopy) return; 
    return(

        <div className="H_mainContainer">
            {/* MAIN HOME */}
            {!indCat && homeDataCopy && homeDataCopy.map((homeDataObject, index) => {
                {/* Switch between categories */}
               return(
                   <div className = "H_categoryContainer" key = {index}>
                       <CommonHomeCard 
                        title = {homeDataObject.hometitle}
                        items = {homeDataObject.tracks}
                        showPlayHomeBtn = {showPlayHomeBtn}
                        />
                   </div>
               )
            })}

            {/* IND_CATEGOTY */}
            {indCat && indData && indData.map((indDataObject, index) => {
                        {/* Switch between categories */}
                    return(
                        <div className = "H_categoryContainer" key = {index}>
                            <CommonHomeCard
                                title = {indDataObject.hometitle}
                                items = {indDataObject.tracks}
                                showPlayHomeBtn = {false}
                                />
                        </div>
                    )
                    })}
        </div>
    )
}