import React, { Component } from 'react'
    import * as THREE from 'three'
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
    import "./Raycaster.css"
    export default class Raycaster extends Component {
    initThree(){
     let scene 
     let camera
     let renderer
     let group
     let resArray={
        texture:[],
        gltf:[],
        font:[],
    }
    let toggleTip =getLoadingfn()
    let hasLoadedNum = 0
    let totalLoadedResNum = 0
     for(let attr in resArray)
     {
         totalLoadedResNum+=resArray[attr].length
     }
    let container = document.getElementById("RaycasterContainer")
     let width = container.clientWidth
     let height = container.clientHeight
     let leave =false
     let controls
     function leavePage(params) {
        leave = true
        let gContainer= document.querySelector(".dg.a")
       let gContainerParent = document.querySelector(".dg.ac")
       if(gContainer&&gContainerParent)
       {
         gContainerParent.removeChild(gContainer)
       }    
     }
     const clock = new THREE.Clock()
     let object1
     let object2
     let object3
     const mouse = new THREE.Vector2()
     let currentIntersect = null
     container.addEventListener('mousemove',(e)=>{
        mouse.x = e.layerX / width *2 -1
        mouse.y = - (e.layerY/height)*2 +1
     })

     container.addEventListener('click',()=>{
         if(currentIntersect)
         {
             console.log('click')
            switch(currentIntersect.object)
            {
            case object1 :
                console.log('1')
                ;break
                case object2 :
                console.log('2')
                ;break
                default :
                    console.log('3')
                    ;break

            }
         }
     })
     function render(params) {
      if(object1&&object2&&object3)
      {  
          const t = clock.getElapsedTime()
          object1.position.y = Math.sin(t*0.3)*1.5
         object2.position.y = Math.sin(t*0.8)*1.5
         object3.position.y = Math.sin(t*1.4)*1.5

         raycaster.setFromCamera(mouse,camera)

         const objectsToTest = [object1,object2,object3]
         const intersects = raycaster.intersectObjects(objectsToTest);
        
         for(const object of objectsToTest)
         {
            object.material.color.set('#ff0000')
         }
         
         for(const intersect of intersects)
         {
             intersect.object.material.color.set('#0000ff');
         }

         if(intersects.length)
         {
             if(currentIntersect === null){

             }
             currentIntersect = intersects[0]
         }else{
             if(currentIntersect)
             {

             }
            currentIntersect = null 
         }

         controls.update()
      }
         renderer.render(scene,camera)
     }
    
     function  animate() {
         !leave && window.requestAnimationFrame(animate)
         render()
     }

     function loadResource(loader,resArray) {
        return  new Promise((res,rej)=>{   
              let allRes={}
              let count=0
              if(resArray.length===0)
              {
                  res(allRes)
              }else{
      
               resArray.forEach(path => {
                  loader.load(path,(res1)=>{
                     allRes[path]=res1
                      count++
                      hasLoadedNum++
                      toggleTip(hasLoadedNum)
                      if(count===resArray.length)
                      {
                         res(allRes)
                      }
                  })
               });   
              }
             
          }) 
       }
  
       function getLoadingfn(tip) {
           let H1 = document.createElement('h1')
           H1.innerText = '正在加载....'
           let isHided=false
            return function(progress){
             if(!progress)
             {
                 if(!isHided)
               {
              container.appendChild(H1)  
               }else{
              container.removeChild(H1) 
               }
             isHided =!isHided
             }else{
              H1.innerText = '加载中'+progress+'/'+totalLoadedResNum
             }
             
            }      
       }

        let raycaster = new THREE.Raycaster()
       function addComponents(resource) {
           
         object1 = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5,16,16),
         new THREE.MeshBasicMaterial({
             color:"#ff0000"
         }))
         
         object1.position.x = -2

          object2 = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5,16,16),
         new THREE.MeshBasicMaterial({
             color:"#ff0000"
         }))
         
        
           object3 = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5,16,16),
         new THREE.MeshBasicMaterial({
             color:"#ff0000"
         }))

          object3.position.x = 2


          scene.add(object1,object2,object3);
  
        //    const  rayOrigin = new THREE.Vector3(-3,0,0)
        //    const rayDirection  = new THREE.Vector3(10,0,0)
        //    rayDirection.normalize()
        //   rayCaster.set(rayOrigin,rayDirection)

        //   // const intersect = rayCaster.intersectObject(object2)

        //   const intersects = rayCaster.intersectObjects([object1,object2,object3])

        //   console.log(intersects);
          
 




       }
  
  
       function load()
       {
        toggleTip()
      return  Promise.all([
        loadResource(new THREE.TextureLoader(),resArray['texture']),
        loadResource( new GLTFLoader(),resArray['gltf']),
        loadResource(new FontLoader(),resArray['font']),
        ])
  
       }
    
     function init(params) {
         scene = new THREE.Scene()
       
    
         camera = new THREE.PerspectiveCamera(45,1,0.1,2000)
         camera.position.x  =-5
         camera.position.y = 5
         camera.position.z = 5
         camera.lookAt(camera.position)
    
         group = new THREE.Group()
         scene.add(group)
    
         load().then(
            (resource)=>{
                toggleTip()
                let arr = {}
             for(let res of resource)
             {
                 for(let attr in res)
                 {
                     arr[attr] = res[attr];
                 }
             }
                addComponents(arr) 
            }
         )

    
         renderer = new THREE.WebGLRenderer()
         renderer.setPixelRatio(width/height)
         renderer.setClearColor(0x00ff00,0.1)
         renderer.setSize(width,height)
         
         container.appendChild(renderer.domElement)
         controls = new OrbitControls(camera, renderer.domElement);
     controls.update();
     }
    
      init()
      animate()
      
       return leavePage
    }
    
    
    componentDidMount(){
    
        this.leavePage = this.initThree()
    }
        render() {
            return (
                <div id="RaycasterContainer">
                  
                </div>
            )
        }
    
    componentWillUnmount(){
        this.leavePage()
    }
    
    }