import React, { Component } from 'react'
    import * as THREE from 'three'
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import "./Particles.css"
    export default class Particles extends Component {
    initThree(){
     let scene 
     let camera
     let renderer
     let group
     let textureLoader
     let gltfLoader 
     let particles
     let controls 
     let resArray={
        texture:[],
        model:[]
    }
    let pp={}  
    const count = 20000
    let particlesGeomerty
    for(let i=1;i<14;i++)
     {
        pp[i]='./textures/particles/'+i+".png"
         resArray.texture.push(pp[i])
     }

    let toggleTip =getLoadingfn()
    let hasLoadedNum = 0
    let totalLoadedResNum = resArray['texture'].length+resArray['model'].length
     let container = document.getElementById("ParticlesContainer")
     let width = container.clientWidth
     let height = container.clientHeight
     let leave =false
    const clock =new THREE.Clock()
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
        const t = clock.getElapsedTime()
        if(particles)
        {
            particles.rotation.y = -t*0.02
        }
        if(particlesGeomerty)
          {
              for(let i=0;i<count;i++)
          {
          const i3= i*3
           const x = particlesGeomerty.attributes.position.array[i3]

              particlesGeomerty.attributes.position.array[i3+1] = Math.sin(t+x)
          }
          particlesGeomerty.attributes.position.needsUpdate = true
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
         
          particlesGeomerty = new THREE.BufferGeometry(1,32,32)
     

         const positions = new Float32Array(count*3)
         const colors = new Float32Array(count*3)
         for(let i=0;i<count*3;i++){
          positions[i] = (Math.random()-0.5)*10
          colors[i]=(Math.random())
         }

        particlesGeomerty.setAttribute('position',new THREE.BufferAttribute(positions,3))
        particlesGeomerty.setAttribute('color',new THREE.BufferAttribute(colors,3))
        


         const particlesMaterial = new THREE.PointsMaterial({
             size:0.1,
             sizeAttenuation:true,
             transparent:true,
             alphaMap:resource[pp[2]],
            // alphaTest:0.001,
             //depthTest:false,
             depthWrite:false,
            blending:THREE.AdditiveBlending,
            vertexColors:true
         })

          particles  =new THREE.Points(particlesGeomerty,particlesMaterial)
         scene.add(particles)


       // scene.add(new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial()))
          
     


       }
  
  
       function load()
       {
          textureLoader = new THREE.TextureLoader()
          gltfLoader = new GLTFLoader()
          toggleTip()
        return  Promise.all([
              loadResource(textureLoader,resArray['texture']),
              loadResource(gltfLoader,resArray['model'])
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
                <div id="ParticlesContainer">
                  
                </div>
            )
        }
    
    componentWillUnmount(){
        this.leavePage()
    }
    
    }