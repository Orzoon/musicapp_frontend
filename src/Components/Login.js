import React,{useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom"


// importing styles
import "../styles/login.scss"

// importing helper functions
import { 
    loginAuth,
    checkAuth,
    setCookie,
    getCookie,
    deleteCookie
 } from "../helper";

 // importing icons
 import {
    BassonSVG,
    DvdcaseSVG,
    HeadphoneSVG,
    MikeSVG,
    MusicnoteSVG,
    DrumSVG,
    GuitarSVG
 } from "../subComponents/svg";

 import {FaExclamation} from "react-icons/fa"
 import {MdClose} from "react-icons/md"


const AuthLink = loginAuth();
function Login(){
    const [showModal, setShowModal] = useState(null);
    const modalRef = useRef();
    const btnRef = useRef();
    const navigate = useNavigate();
    const [loading,setLoading] = useState(true);
    //useEffect
    useEffect(()=> {
        // setting loading
        // deleting the cookie--for test
        if(window.location.href.split("#")[1] === "logout"){
            window.history.pushState("", document.title, window.location.pathname
            + window.location.search);
            deleteCookie()
            setCookie("LoggedIn","false", 0)
        }
        // second to login
            //----- to the app
        const _loggedStatus = getCookie("LoggedIn");
        console.log("loggedStatus", _loggedStatus)
        if(_loggedStatus && _loggedStatus === "true"){
            const tokenExists = checkAuth();
            if(tokenExists){
                navigate("/app/home")
            }
        }
        else {
            // check the url------------>
            const currentLoginUrl = window.location.href;
            const splittedURL = currentLoginUrl.split("#")
            if(splittedURL.length > 1){
                console.log("Fourth")
                const _tokenPart = splittedURL[1].split("&");
                if(_tokenPart.length === 3){
                   const nameValues = _tokenPart.map(item => {
                       return item.split("=")[0]
                   })
                   const nameValuesAllowed = ["access_token", "token_type", "expires_in"]
                   const matches = nameValues.every(item => nameValuesAllowed.includes((item)))
                   
                   /*********************************/
                   if(matches){
                        const Values = _tokenPart.map(item => {
                            return item.split("=")[1]
                        })

                        //-----setting two variables
                        setCookie("LoggedIn", "true", parseInt(Values[2]))
                        setCookie("MusicAppToken", Values[0], parseInt(Values[2]))
                        // clearing the url
                        window.history.pushState("", document.title, window.location.pathname
                                                       + window.location.search);

                        // to app
                
                        navigate("/app/home")
                         
                   }else{
                    setLoading(false)
                   }
                }
            }

            window.addEventListener("click", modalOutsideClickHandler)
            setLoading(false)
        }


        return (() => window.removeEventListener("click", modalOutsideClickHandler))
    }, [loading, navigate]);

    useEffect(() => {
        if(!loading){
            setTimeout(() => {
                setShowModal(true)
            }, 5700)
        }
    }, [loading])

    
    // button auth to spotify
    function AuthLinkhandler(e){
        e.preventDefault();  
        window.location.href= AuthLink
    }

    function modalOutsideClickHandler(e){
        if(btnRef && btnRef.current && btnRef.current.contains(e.target)){
            return
        }
        if(modalRef && modalRef.current && !modalRef.current.contains(e.target)){

                setShowModal(false)
                
        }
    }
    if(loading) return null
    return(
        <div className="mainContainer">

            {/* <LoginHeader/> */}

            {/* Everything position relative to the Parent */}
            <div className = "_LWrapperContainer">

                    <div className = "_LWhiteBG"></div>
                    <div className = "_LBlackBG"></div>
                    {/* TEXT_CONAINTER Z__9  */}
                    <div className = "_LTextContainer">
                        <div className = "_LPWrapper WrapperM">
                            <div className = "_LPDiv LPS">
                                <p>S</p>
                            </div>
                        </div>
                        <div className = "_LPWrapper WrapperS">
                            <div className = "_LPDiv LPM" >
                                <p>M</p>
                            </div>
                        </div>
                        <div className = "_LDivDiv"></div>
                    </div>

                    <div className = "_LSVGMainContainer">
                        {/* SVG_______ICONS */}
                        <div className = "_LSVGContainer icon1 ">
                            <BassonSVG/>
                        </div>
                        <div className = "_LSVGContainer icon2">
                            <DvdcaseSVG/>
                        </div>
                        <div className = "_LSVGContainer icon3">
                            <HeadphoneSVG/>
                        </div>
                        <div className = "_LSVGContainer icon4">
                            <MikeSVG/>
                        </div>
                        <div className = "_LSVGContainer icon5">
                            {/* <MusicnoteSVG/> */}
                            <DrumSVG/>
                        </div>
                        <div className = "_LSVGContainer icon6">
                            <GuitarSVG/>
                        </div>
                    </div>

                    <div className = "_MainText">
                            <div className = "textBox textBox1">
                                <div className = "textCover textCover1">
                                    <p>M</p>
                                </div>
                            </div>

                            <div className = "textBox textBox2">
                                <div className = "textCover textCover2">
                                    <p>U</p>
                                </div>
                            </div>

                            <div className = "textBox textBox3">
                                <div className = "textCover textCover3">
                                    <p className = "SCOLOR">S</p>
                                </div>
                            </div> 

                            <div className = "textBox textBox4">
                                <div className = "textCover textCover4">
                                    <p className = "SCOLOR">I</p>
                                </div>
                            </div>

                            <div className = "textBox textBox5">
                                <div className = "textCover textCover5">
                                    <p>F</p>
                                </div>
                            </div>

                            <div className = "textBox textBox6">
                                <div className = "textCover textCover6">
                                    <p>Y</p>
                                </div>
                            </div>                           
                            
                    </div>
                    
                    <div className = "BtnContainer">
                        <button
                            onClick={(e) => AuthLinkhandler(e)} 
                            className = "loginButton">
                            Login
                        </button>
                        <div className="BtnLine lineTop"></div>
                        <div className="BtnLine lineLeft"></div>
                        <div className="BtnLine lineRight"></div>
                        <div className="BtnLine lineBottom"></div>
                    </div>

            </div>

            <div className = "btnExclamation">
                <button
                    ref = {btnRef}
                    onClick={(e) => setShowModal(true)} 
                    className="btnExc">
                    <FaExclamation/>
                </button>
                <div className="Btncircle">
                    <div className = "BtnRipple"></div>
                    <div className = "BtnRipple"></div>
                </div>
                {/* <div className="Btncircle circle2"></div>
                <div className="Btncircle circle3"></div>
                <div className="Btncircle circle4"></div> */}
            </div>

            {showModal && 
                <div className = "LoginModalContainer">
                        <div className = "L_modal" ref = {modalRef}>
                            <h2>About</h2>
                            <div className = "L_modalP">
                                    <p><span className = "P_note">Spotify Login</span> is required to be able to display user data from their API. After finishing you will be redirected back </p>
                                    <p><span className = "P_note">Note:</span><br/>
                                        All the data accessed by this app <b>are not stored, used, or shared</b> to any external sources. The app code can be found <a href = "https://github.com/Orzoon/musicapp_frontend" target = "_blank" rel="noreferrer">here</a>
                                    </p>
                                    <p>
                                        Before logging in you are able to view all the information accessed, which is required by this app to work.
                                    </p>
                            </div>
                            <button
                                onClick={(e) => setShowModal(false)} 
                                className="L_btnClose">
                                <MdClose/>
                            </button>
                        </div>
                </div>
            }

        </div>
    )
}

export default Login;