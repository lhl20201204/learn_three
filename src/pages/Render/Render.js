import React, { Component } from 'react'
    import * as THREE from 'three'
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
    import "./Render.css"
    import * as dat from "dat.gui"
    export default class Render extends Component {
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
    const gui = new dat.GUI()
     for(let attr in resArray)
     {
         totalLoadedResNum+=resArray[attr].length
     }
    let container = document.getElementById("RenderContainer")
     let width = container.clientWidth
     let height = container.clientHeight
     let leave =false
     let controls
     const  cubeTextureLoader =  new THREE.CubeTextureLoader()
     function leavePage(params) {
        leave = true
        let gContainer= document.querySelector(".dg.a")
       let gContainerParent = document.querySelector(".dg.ac")
       if(gContainer&&gContainerParent)
       {
         gContainerParent.removeChild(gContainer)
       }    
     }
     function render(params) {
    
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

       function addComponents(resource) {
        // const  testSphere = new THREE.Mesh(
        //     new THREE.SphereBufferGeometry(1,32,32),
        //     new THREE.MeshStandardMaterial()
        // )
        // testSphere.position.set(0,1,0)
        // scene.add(testSphere)




       const helmetModel = new THREE.Group()
        //  console.log(resource[flightHelmet].scene.children)
         for(const child of resource[flightHelmet].scene.children)
         {
                helmetModel.add(child)
         }

         helmetModel.scale.set(10,10,10)
         helmetModel.position.set(0,-4,0)
         helmetModel.rotation.y = Math.PI *0.5
         gui.add(helmetModel.rotation,'y').min(-Math.PI)
         .max(Math.PI).step(0.001).name('rotation')
         scene.add(helmetModel)

        const enviromentMap = cubeTextureLoader.load([
              "/textures/environmentMaps/1/px.png",
              "/textures/environmentMaps/1/nx.png",
              "/textures/environmentMaps/1/py.png",
              "/textures/environmentMaps/1/ny.png",
              "/textures/environmentMaps/1/pz.png",
              "/textures/environmentMaps/1/nz.png",
        ])
        scene.background = enviromentMap
        scene.enviroment = enviromentMap
        enviromentMap.encoding = THREE.sRGBEncoding

        
        let object = {
            envMapIntensity:5
        }

       const updateAllMaterials = ()=>{
           scene.traverse((child)=>{
              if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
             {
                  child.material.envMap = enviromentMap
                  child.material.envMapIntensity = object.envMapIntensity
              }
            })
       }

        gui.add(object,'envMapIntensity').min(0).max(10).step(0.001).onChange(()=>{
            updateAllMaterials()
        })


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
         camera.position.x  = 20
         camera.position.y = 20
         camera.position.z = 20
         camera.lookAt(camera.position)

       const  light = new THREE.DirectionalLight('#ffffff',1)
         light.position.set(0.25,3,-2.25)
         scene.add(light)
          gui.add(light,'intensity').min(0).max(10).step(0.01).name('lightIntensity')
          gui.add(light.position,'x').min(-5).max(5).step(0.001).name('lightX');
          gui.add(light.position,'y').min(-5).max(5).step(0.001).name('lightY');
          gui.add(light.position,'z').min(-5).max(5).step(0.001).name('lightZ');

    
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
         renderer.physicallyCorrectLights =true
         renderer.outputEncoding = THREE.sRGBEncoding
         renderer.toneMapping = THREE.ACESFilmicToneMapping
         
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
                <div id="RenderContainer">
                  
                </div>
            )
        }
    
    componentWillUnmount(){
        this.leavePage()
    }
    
    }