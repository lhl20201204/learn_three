import React,{useEffect,useState} from 'react'
//var FileSaver = require('file-saver');
//import { withRouter } from "react-router-dom";
import "./Hello.css"
import axios from 'axios'
function Hello() {
   const [text,setText] = useState('')
    useEffect(() => {
        const videoSource = document.getElementById('videoSource');
        const video = document.getElementById('video');
        video.muted = true
const start = document.getElementById('start');
const stop = document.getElementById('stop');
const download = document.getElementById('download');


const displayMediaOptions = {
video: true,
audio: true
}
console.log(start)
start.addEventListener('click',function(evt){
startCapture();
},false)

stop.addEventListener('click',function(evt){
stopCapture();
},false)

download.addEventListener('click',function(evt){
mydownload();
},false)


let recorder;
function startCapture() {

navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(captureStream => {
window.URL.revokeObjectURL(video.src);
video.srcObject = captureStream;
recorder = new MediaRecorder(captureStream);
recorder.start();
    });

// 删除原来的blob 
}

function stopCapture() {
let tracks = video.srcObject.getTracks();
tracks.forEach(track => {
    track.stop();
});
recorder.stop();
recorder.addEventListener('dataavailable',(event)=>{
    let videoUrl = URL.createObjectURL(event.data, {type:'video/mp4'});
    console.log('加载',videoUrl)
    video.srcObject = null;
    videoSource.src = videoUrl
    video.src = videoUrl;
})

}

function mydownload(){
const name = new Date().toISOString().slice(0,19).replace('T',' ').replace(' ','_').replace(/:/g,'-');
const a = document.createElement('a');
a.href = video.src;
a.download = `我的录制视频${name}.mp4`;
document.body.appendChild(a);
a.click();

}

 





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
           <video id="video" style={{
               width:"500px",
                height:"400px",
           }} autoPlay controls>
        <source id="videoSource"
        type="video/mp4" />
      </video>
 <button id="start">start </button>
<button id="stop">stop </button>
   <button id="download"> download</button> 
        </div>
    )
}
export default Hello