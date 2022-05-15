import { Link, NavLink } from "react-router-dom"
export default function NavPlaylist({item}){
    return(
        <li>
            <NavLink 
                to ={`/app/playlist/${item.id}`}
                className = {({isActive}) => isActive ? "MA_plaulistA_Active" : ""}>
                    {item.name}
            </NavLink>
        </li>
    )
}
