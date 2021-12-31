import React, { Component } from 'react'
    import * as THREE from 'three'
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
    import "./Shader.css"
    import testVertexShader from './shaders/test/vertex.glsl'
    import testFragmentShader from './shaders/test/fragment.glsl'

    export default class Shader extends Component {
    initThree(){
     let scene 
     let camera
     let renderer
     let group
     let light
     const MAP = './Earth.png'
     let resArray={
        texture:[MAP],
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
    let container = document.getElementById("ShaderContainer")
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
        
        const material = new THREE.RawShaderMaterial({
            vertexShader:`
               uniform mat4 projectionMatrix;
               uniform mat4 viewMatrix;
               uniform mat4 modelMatrix;


               attribute vec3 position;

               void main()
               {
                   gl_Position = projectionMatrix * viewMatrix * modelMatrix *vec4(position,1.0);


               }
            
            
            
            `,
            fragmentShader:`
              precision mediump float;


              void main()
              {
                  gl_FragColor =vec4(1.0,0.0,0.0,1.0);
              }
        
            `

        })

        const material2 = new THREE.MeshStandardMaterial({
            roughness:0.5,
            side:THREE.DoubleSide,
            map: resource[MAP]
        })

        const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1,1),true?material:material2)
        plane.rotation.x = -Math.PI/ 2

        scene.add(plane);

       

  


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
         camera.position.x  =5
         camera.position.y = 5
         camera.position.z = 5
         camera.lookAt(camera.position)


         light = new THREE.DirectionalLight('white',1)
         light.position.copy(camera.position)
         scene.add(light);

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
                <div id="ShaderContainer">
                  
                </div>
            )
        }
    
    componentWillUnmount(){
        this.leavePage()
    }
    
    }