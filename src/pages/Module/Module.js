import React, { Component } from 'react'
    import * as THREE from 'three'
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
    import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
    import "./Module.css"
    export default class Module extends Component {
    initThree(){
     let scene 
     let camera
     let renderer
     let group
     const  baseUrl = "./models"
     const duck  = baseUrl+"/Duck/glTF/Duck.gltf"
     const flightHelmet = baseUrl+"/FlightHelmet/glTF/FlightHelmet.gltf"
     const fox = baseUrl+"/Fox/glTF/Fox.gltf"
     let resArray={
        texture:[],
        gltf:[duck,flightHelmet,fox],
        font:[],
    }
    let toggleTip =getLoadingfn()
    let hasLoadedNum = 0
    let totalLoadedResNum = 0
     for(let attr in resArray)
     {
         totalLoadedResNum+=resArray[attr].length
     }
    let container = document.getElementById("ModuleContainer")
     let width = container.clientWidth
     let height = container.clientHeight
     let leave =false
     let controls
     let mixer 
     function leavePage(params) {
        leave = true
        let gContainer= document.querySelector(".dg.a")
       let gContainerParent = document.querySelector(".dg.ac")
       if(gContainer&&gContainerParent)
       {
         gContainerParent.removeChild(gContainer)
       }    
     }
     let ptime = 0
     const clock = new THREE.Clock()
     function render(params) {
         let t = clock.getElapsedTime()
         let deltaTime  =  t - ptime
         ptime = t
         if(mixer)
         {
             mixer.update(deltaTime)
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

       let floor 
       let light
       let duckModel
       let helmetModel
       let foxModel
       function addToScene()
       {
           scene.add(floor)
           scene.add(new THREE.AxesHelper())
           scene.add(light)
           scene.add(duckModel)
           scene.add(helmetModel)
           scene.add(foxModel)
       }

       function addComponents(resource) {
           console.log(resource[duck])
         floor = new THREE.Mesh(
             new THREE.PlaneBufferGeometry(10,10),
             new THREE.MeshStandardMaterial({
                 color:'#444444',
                 metalness:0,
                 roughness:0.5
             })
         )
          
         floor.rotation.x = - Math.PI /2

         light = new THREE.DirectionalLight(0xffffff,1)
         light.position.set(5,5,5)
         light.lookAt(new THREE.Vector3(0,0,0))
         light.castShadow =true
         
         duckModel= resource[duck].scene.children[0]
         duckModel.position.set(2,0,0)
         duckModel.rotation.set(0,-Math.PI/2,0)

        //  helmetModel = resource[flightHelmet].scene.children[0]
         //helmetModel.scale.set(0,3,3)
         // helmetModel.rotation.set(0,-Math.PI/4,0)
         // helmetModel.position.set(-0,-0.3,1)
         helmetModel = new THREE.Group()
        //  console.log(resource[flightHelmet].scene.children)
         for(const child of resource[flightHelmet].scene.children)
         {
                helmetModel.add(child)
         }
         
         foxModel = resource[fox].scene
         foxModel.scale.set(0.025,0.025,0.025)

         mixer = new THREE.AnimationMixer(foxModel)
         let action =mixer.clipAction(resource[fox].animations[2])
         action.play()
         
         addToScene()
        }
  
  
       function load()
       {
        toggleTip()
        let gltfLoader = new GLTFLoader()
        gltfLoader.setDRACOLoader(new DRACOLoader())
      return  Promise.all([
        loadResource(new THREE.TextureLoader(),resArray['texture']),
        loadResource(gltfLoader ,resArray['gltf']),
        loadResource(new FontLoader(),resArray['font']),
        ])
  
       }
    
     function init(params) {
         scene = new THREE.Scene()
       
    
         camera = new THREE.PerspectiveCamera(45,1,0.1,2000)
         camera.position.x  =10
         camera.position.y = 10
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
         // renderer.setClearColor(0x00ff00,0.1)
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
                <div id="ModuleContainer">
                  
                </div>
            )
        }
    
    componentWillUnmount(){
        this.leavePage()
    }
    
    }