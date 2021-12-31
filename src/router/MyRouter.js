import React,{useState} from 'react'
import {BrowserRouter,Link , Route,Routes} from "react-router-dom";
import "./MyRouter.css"
import {arr} from "./route"
export default function MyRouter() {
    const [cur,setCur] = useState(0)
   false&& console.log("当前为cur",cur)//cur
    return (   
    <BrowserRouter>
    <div className="parent">{
        arr.map((v,i)=>
            <Link to={v.to} className={cur!==i?"child":"child activate"}  key={i} onClick={()=>{
                setCur(i)
            }}>{v.content}</Link>
        )
        }
    </div>
    <Routes>
        {
           arr.map((v,i)=>
           <Route exact path={v.to} key={i} element={<div><v.componment></v.componment></div>}> </Route>
       )
       }
	 </Routes >
    </BrowserRouter>
    )
}
