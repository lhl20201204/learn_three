import React, { Component } from 'react'
    import * as THREE from 'three'
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
    import "./Galaxy.css"
import { GUI } from 'dat.gui';
    export default class Galaxy extends Component {
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
    const parameters= {}
    let toggleTip =getLoadingfn()
    let hasLoadedNum = 0
    let totalLoadedResNum = 0
     for(let attr in resArray)
     {
         totalLoadedResNum+=resArray[attr].length
     }
    let container = document.getElementById("GalaxyContainer")
     let width = container.clientWidth
     let height = container.clientHeight
     let leave =false
    // let count = 0
     let generateGalaxy

    
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
        // count++
        // if(count%300===0)
        // {
           
        //     parameters.insideColor =new THREE.Color(Math.random(),Math.random(),Math.random())
        //     parameters.outsideColor =new THREE.Color(Math.random(),Math.random(),Math.random())
        //     console.log(parameters.insideColor,parameters.outsideColor)
        //    generateGalaxy()
        // }

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
        parameters.count = 267200
        parameters.size =0.01
        parameters.radius = 5
        parameters.branches = 3
        parameters.spin =-3.707
        parameters.randomness = 0.2
        parameters.randomnessPower = 4.907
        parameters.insideColor = "#d92f6c"
        parameters.outsideColor = "#00b1eb"
        const gui = new GUI()
        gui.add(parameters,'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
        gui.add(parameters,'size').min(0.001).max(0.1).step(0.01).onFinishChange(generateGalaxy)
        gui.add(parameters,'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
        gui.add(parameters,'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
        gui.add(parameters,'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
        gui.add(parameters,'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
        gui.add(parameters,'randomnessPower').min(0).max(10).step(0.001).onFinishChange(generateGalaxy)
        gui.addColor(parameters,'insideColor').onFinishChange(generateGalaxy)
        gui.addColor(parameters,'outsideColor').onFinishChange(generateGalaxy)
        
        let geometry =null
        let material = null
        let points = null


        generateGalaxy =   function ()
          {
             if(points)
             {
                geometry.dispose()
                material.dispose()
                scene.remove(points)
             }

               geometry = new THREE.BufferGeometry()
             const  positions = new Float32Array(parameters.count*3)
             const colors = new Float32Array(parameters.count *3)
             const colorInside = new THREE.Color(parameters.insideColor)
             const colorOutside = new THREE.Color(parameters.outsideColor)
             //colorInside.lerp(colorOutside,0.5)
              for(let i=0;i<parameters.count;i++)
              { 
                  const i3 = i*3
                  const radius =Math.random() * parameters.radius
                  const spinAngle = radius*parameters.spin
                  const branchAngle = i % parameters.branches/parameters.branches *2* Math.PI
                  const randomX = Math.pow(Math.random(),parameters.randomnessPower)*(Math.random()<0.5?1:-1)
                  const randomY = Math.pow(Math.random(),parameters.randomnessPower)*(Math.random()<0.5?1:-1)
                  const randomZ = Math.pow(Math.random(),parameters.randomnessPower)*(Math.random()<0.5?1:-1)
                  

                  positions[i3]   = Math.cos(branchAngle+spinAngle)*radius+randomX
                  positions[i3+1] =0+randomY
                  positions[i3+2] =Math.sin(branchAngle+spinAngle)*radius+randomZ
                  
                  const mixedColor = colorInside.clone()
                  mixedColor.lerp(colorOutside,radius/parameters.radius)
                  colors[i3] =mixedColor.r
                  colors[i3+1] =mixedColor.g
                  colors[i3+2] =mixedColor.b
              }
              geometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
              geometry.setAttribute('color',new THREE.BufferAttribute(colors,3))

               material  = new THREE.PointsMaterial({
                  size:parameters.size,
                  sizeAttenuation:false,
                  blending:THREE.AdditiveBlending,
                  vertexColors:true
              })
              points = new THREE.Points(geometry,material)
              scene.add(points)

          }
        
            generateGalaxy()

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
        
        // scene.add(new THREE.AxesHelper())
    
         camera = new THREE.PerspectiveCamera(45,1,0.1,2000)
         camera.position.x  =-5
         camera.position.y = 10
         camera.position.z = 30
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
        //  renderer.setClearColor(0x00ff00,0.1)
         renderer.setSize(width,height)
         
         container.appendChild(renderer.domElement)
         let controls = new OrbitControls(camera, renderer.domElement);
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
                <div id="GalaxyContainer">
                  
                </div>
            )
        }
    
    componentWillUnmount(){
        this.leavePage()
    }
    
    }