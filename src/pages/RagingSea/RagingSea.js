import React, { Component } from 'react'
    import * as THREE from 'three'
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
    import "./RagingSea.css"
    import testVertexShader from './shaders/vertex.glsl'
    import testFragmentShader from './shaders/fragment.glsl'
    import * as dat from 'dat.gui'
    export default class RagingSea extends Component {
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
    let container = document.getElementById("RagingSeaContainer")
     let width = container.clientWidth
     let height = container.clientHeight
     let leave =false
     let controls
     let material
     const gui = new dat.GUI()
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
         const t = clock.getElapsedTime()
         if(material)
         {
           material.uniforms.uTime.value = t  
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

       function addComponents(resource) {
           const object  = {
               depthColor:'#186691',
               surfaceColor: '#9bd8ff'
           }
            material =new THREE.ShaderMaterial({
                vertexShader:testVertexShader,
                fragmentShader:testFragmentShader,
                side:THREE.DoubleSide,
                uniforms:{
                    uTime:{
                        value:0
                    },
                    uBigWavesElevation:{
                        value:0.2,
                    },
                    uBigWavesFrequency: {
                        type:  'vec2',
                        value: new THREE.Vector2(4,1.5),
                    },
                    uBigWavesSpeed:{
                        value:0.75
                    },
                    uSmallWavesElevation:{
                        value:0.15,
                    },
                    uSmallWavesFrequency: {
                        value: 3,
                    },
                    uSmallWavesSpeed:{
                        value:0.2
                    },
                    uSmallWavesIterations:{
                        value:0.4
                    },
                    uDepthColor:{
                        value:new THREE.Color(object.depthColor) 
                    },
                    uSurfaceColor:{
                        value:new THREE.Color(object.surfaceColor) 
                    },
                    uColorOffset:{
                        value:0.08
                    },
                    uColorMultiplier:{
                        value:5
                    }
                }
            })
            const mesh  =new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2,512,512),material)
            mesh.rotation.x = - Math.PI/2;
            gui.add(material.uniforms.uBigWavesElevation,'value').min(0).max(1).step(0.0001).name('uBigWavesElevation')
            gui.add(material.uniforms.uBigWavesFrequency.value,'x').min(0).max(10).step(0.0001).name('uBigWavesFrequencyX')
            gui.add(material.uniforms.uBigWavesFrequency.value,'y').min(0).max(10).step(0.0001).name('uBigWavesFrequencyY')
            gui.add(material.uniforms.uBigWavesSpeed,'value').min(0).max(4).step(0.0001).name('uBigWavesSpeed')
            
            gui.add(material.uniforms.uSmallWavesElevation,'value').min(0).max(1).step(0.0001).name('uSmallWavesElevation')
            gui.add(material.uniforms.uSmallWavesFrequency,'value').min(0).max(30).step(0.0001).name('uSmallWavesFrequency')
            gui.add(material.uniforms.uSmallWavesSpeed,'value').min(0).max(4).step(0.0001).name('uSmallWavesSpeed')
            gui.add(material.uniforms.uSmallWavesIterations,'value').min(0).max(5).step(0.0001).name('uSmallWavesIterations')
            


            gui.addColor(object,'depthColor').onChange(()=>material.uniforms.uDepthColor.value.set(object.depthColor)).name('depthColor')
            gui.addColor(object,'surfaceColor').onChange(()=>material.uniforms.uSurfaceColor.value.set(object.surfaceColor)).name('surfaceColor')

            
            gui.add(material.uniforms.uColorOffset,'value').min(0).max(1).step(0.0001).name('uColorOffset')
            gui.add(material.uniforms.uColorMultiplier,'value').min(0).max(10).step(0.0001).name('uColorMultiplier')
            
           
            
            scene.add(mesh);
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
         camera.position.x  =0
         camera.position.y = 0
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
        //  renderer.setClearColor(0x00ff00,0.1)
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
                <div id="RagingSeaContainer">
                  
                </div>
            )
        }
    
    componentWillUnmount(){
        this.leavePage()
    }
    
    }