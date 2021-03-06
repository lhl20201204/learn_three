import React, { Component } from 'react'
    import * as THREE from 'three'
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
    import "./Galaxy.css"
import { GUI } from 'dat.gui';
import testVertexShader from './shaders/vertex.glsl'
    import testFragmentShader from './shaders/fragment.glsl'
    
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
    let material
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
     const clock = new THREE.Clock()

     function render(params) {
         if(material)
         {
             const t =clock.getElapsedTime()
             material.uniforms.uTime.value= t * 0.1
         } 
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
           H1.innerText = '????????????....'
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
              H1.innerText = '?????????'+progress+'/'+totalLoadedResNum
             }
             
            }      
       }

       function addComponents(resource) {
            parameters.count =200000
               parameters.size =0.01
              parameters.radius = 5
              parameters.branches = 3
              parameters.spin =0
              parameters.randomness = 0.5
              parameters.randomnessPower = 3
              parameters.insideColor = "#ff6030"
              parameters.outsideColor = "#1b3984" 
      generateGalaxy =   function ()
          {
              console.log('rerun')
             if(points)
             {
                geometry.dispose()
                material.dispose()
                scene.remove(points)
             }

               geometry = new THREE.BufferGeometry()
             const  positions = new Float32Array(parameters.count*3)
             const colors = new Float32Array(parameters.count *3)
             const scales = new Float32Array(parameters.count * 1)
             const randomness = new Float32Array(parameters.count *3)
             const colorInside = new THREE.Color(parameters.insideColor)
             const colorOutside = new THREE.Color(parameters.outsideColor)
             //colorInside.lerp(colorOutside,0.5)
            
              for(let i=0;i<parameters.count;i++)
              { 
                  const i3 = i*3
                  const random = Math.random()
                  const radius =random * parameters.radius
                  const spinAngle = radius*parameters.spin
                  const branchAngle = i % parameters.branches/parameters.branches *2* Math.PI
                  const rrrr = random * 1.3
                  const randomX = Math.pow(Math.random(),parameters.randomnessPower)*(Math.random()<0.5?1:-1)* rrrr
                  const randomY = Math.pow(Math.random(),parameters.randomnessPower)*(Math.random()<0.5?1:-1) * rrrr
                  const randomZ = Math.pow(Math.random(),parameters.randomnessPower)*(Math.random()<0.5?1:-1)* rrrr
                   

                  positions[i3]   = Math.cos(branchAngle+spinAngle)*radius +randomX
                  positions[i3+1] =0+randomY
                  positions[i3+2] =Math.sin(branchAngle+spinAngle)*radius +randomZ
                  
                  const mixedColor = colorInside.clone()

                  mixedColor.lerp(colorOutside,random)
                  colors[i3] =mixedColor.r
                  colors[i3+1] =mixedColor.g
                  colors[i3+2] =mixedColor.b


                  randomness[i3] = Math.random()
                  randomness[i3+1] = Math.random()
                  randomness[i3+2] = Math.random()

                  scales[i] = Math.random()
              }
              geometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
              geometry.setAttribute('color',new THREE.BufferAttribute(colors,3))
              geometry.setAttribute('aScale',new THREE.BufferAttribute(scales,1))
            //   geometry.setAttribute('aRandomness',new THREE.BufferAttribute(randomness,3))
               material  = new THREE.ShaderMaterial({
                //   size:parameters.size,
                //   sizeAttenuation:false,
                  depthWrite:false,
                  blending:THREE.AdditiveBlending,
                  vertexShader:testVertexShader,
                  fragmentShader:testFragmentShader,
                  vertexColors:true,
                  uniforms:{
                      uSize:{
                          value: 30 * renderer?renderer.getPixelRatio():2
                      },
                      uTime:{
                          value:0
                      }

                  }
              })
              points = new THREE.Points(geometry,material)
              scene.add(points)

          }
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
        let points = null

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
         camera.position.x  =0
         camera.position.y = 0.5
         camera.position.z = 0
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