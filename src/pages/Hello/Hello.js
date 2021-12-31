import React,{useEffect,useState} from 'react'
//var FileSaver = require('file-saver');
//import { withRouter } from "react-router-dom";
import "./Hello.css"
import axios from 'axios'
function Hello() {
   const [text,setText] = useState('')
    useEffect(() => {
        setTimeout(()=>{
            //console.log(withRouter)
        //history.push('/map')
        },2000)
        return () => {
            
        }
    }, [])


    function write() {
        return ()=>{
           alert(text)
           if(!text)
           {
              alert("不能为空")
               return
           }

           if(text[0]<'A'||text[0]>'Z')
           {
            alert("首字母大写")
            return
           }

        axios.get("http://localhost:80/api/get?name="+text).catch(e=>{
            alert(e)
        }
        )

        //    const reader = new FileReader();
        //    reader.onload = function (e) {
        //      console.log(e.target.result);
        //    };
         } 

    }

 

    return (
        <div>
           请输入你要创建的类名,在pages帮你创建目录以及类以及在router/route自动帮你配制路由<input onChange={(v)=>{
              setText(v.target.value)
           }}/> 
           <br/>
           <button onClick={write()}>确定</button>
           <br/>
              
        </div>
    )
}
export default Hello