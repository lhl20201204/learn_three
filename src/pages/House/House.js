import React, { Component } from 'react'
    import * as THREE from 'three'
 // import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
  import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
  import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
  import "./House.css"
 import * as dat from "dat.gui"
 export default class House extends Component {
    initThree(){
     let scene 
     let camera
     let renderer
     let house
     let fog
     let textureLoader
     let gltfLoader
     let fontLoader
     let ghost1
     let ghost2
     let ghost3
     let controls
     const EARTH = "./Earth.png"
     const PLANE = "./plane.gltf"
     const FONT = "./helvetiker_regular.typeface.json"
     const doorColorTextTure = "./textures/door/color.jpg"
     const doorAlphaTextTure = "/textures/door/alpha.png"
     const doorAmbientOccluTextTure = "/textures/door/ambientOcclusion.jpg"
     const doorHeightTextTure = "/textures/door/height.jpg"
     const doorNormalTextTure = "/textures/door/normal.jpg"
     const doorMetalnessTextTure = "/textures/door/metalness.jpg"
     const doorRoughnessTexture = "/textures/door/roughness.jpg"
     
     const bricksColorTexture = "/textures/bricks/color.jpg"
     const bricksAmbientOccluTexture = "/textures/bricks/ambientOcclusion.jpg"
     const bricksNormalTexture = "/textures/bricks/normal.jpg"
     const bricksRoughnessTexture = "/textures/bricks/roughness.jpg"
     
     const grassColorTexture = "/textures/grass/color.jpg"
     const grassAmbientOccluTexture = "/textures/grass/ambientOcclusion.jpg"
     const grassNormalTexture = "/textures/grass/normal.jpg"
     const grassRoughnessTexture = "/textures/grass/roughness.jpg"
     
     let resArray={
         texture:[
             EARTH,
             doorColorTextTure,
             doorAlphaTextTure,
             doorAmbientOccluTextTure,
             doorHeightTextTure,
             doorNormalTextTure,
             doorMetalnessTextTure,
             doorRoughnessTexture,
             bricksColorTexture,
             bricksAmbientOccluTexture,
             bricksNormalTexture,
             bricksRoughnessTexture,
             grassColorTexture,
             grassAmbientOccluTexture,
             grassNormalTexture,
             grassRoughnessTexture,
        ],
         model:[PLANE],
         font:[FONT]
     }
     let toggleTip =getLoadingfn()
     let hasLoadedNum = 0
     let totalLoadedResNum = 0
     for(let attr in resArray)
     {
         totalLoadedResNum+=resArray[attr].length
     }
     let container = document.getElementById("House")
     let width = container.clientWidth
     let height = container.clientHeight
     let leave =false
     let gui = new dat.GUI()
     console.log(gui)
     const clock = new THREE.Clock()

    
     window.onkeydown =(e)=>{
         if(e.key ==='d')
         {
             camera.position.x += 0.5
         }else if(e.key ==='a')
         {
             camera.position.x -= 0.5
         }else if(e.key ==='w')
         {
             camera.position.z -= 0.5
         }else if(e.key ==='s')
         {
             camera.position.z += 0.5
         }
     }





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
          const elapsedTime = clock.getElapsedTime()
          //controls.update()
          const ghost1Angle  = elapsedTime *0.5
         if(ghost1)
         {
          ghost1.position.x =Math.cos(ghost1Angle)*4
          ghost1.position.z =Math.sin(ghost1Angle)*4
          ghost1.position.y =Math.sin(ghost1Angle*3) 
         }
         const ghost2Angle  =- elapsedTime *0.32
         if(ghost2)
         {
          ghost2.position.x =Math.cos(ghost2Angle)*5
          ghost2.position.z =Math.sin(ghost2Angle)*5
          ghost2.position.y =Math.sin(ghost2Angle*4)+Math.sin(elapsedTime *2.5) 
         }
         const ghost3Angle  = -elapsedTime *0.18
         if(ghost3)
         {
          ghost3.position.x =Math.cos(ghost3Angle)*(7+Math.sin(elapsedTime*0.32))
          ghost3.position.z =Math.sin(ghost3Angle)*(7+Math.sin(elapsedTime*0.5))
          ghost3.position.y =Math.sin(ghost3Angle*4)+Math.sin(elapsedTime*2.5) 
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


     function load()
     {
        textureLoader = new THREE.TextureLoader()
        gltfLoader = new GLTFLoader()
        fontLoader = new FontLoader()
        toggleTip()
      return  Promise.all([
            loadResource(textureLoader,resArray['texture']),
            loadResource(gltfLoader,resArray['model']),
            loadResource(fontLoader,resArray['font']),
        ])

     }

     function addHouse(resource){
         console.log(resource)
          let axhelper = new THREE.AxesHelper(200)
          scene.add(axhelper)
   
        // async  function getP(params) {
        //     new Promise((res,rej)=>{
        //         res(111)
        //     })
        //   }
        
        //   let x = wait getP()
        //   console.log(x)
             
          let floor = new THREE.Mesh(
              new THREE.PlaneBufferGeometry(20,20),
              new THREE.MeshStandardMaterial({
                  map:resource[grassColorTexture],
                  aoMap:resource[grassAmbientOccluTexture],
                  normalMap:resource[grassNormalTexture],
                  roughnessMap:resource[grassRoughnessTexture],
              })
          ) 
          floor.rotation.x = -Math.PI *0.5
          floor.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2))
           floor.receiveShadow =true
          resource[grassColorTexture].repeat.set(8,8)
          resource[grassAmbientOccluTexture].repeat.set(8,8)
          resource[grassNormalTexture].repeat.set(8,8)
          resource[grassRoughnessTexture].repeat.set(8,8)

          resource[grassColorTexture].wrapS = THREE.RepeatWrapping
          resource[grassAmbientOccluTexture].wrapS = THREE.RepeatWrapping
          resource[grassNormalTexture].wrapS = THREE.RepeatWrapping
          resource[grassRoughnessTexture].wrapS = THREE.RepeatWrapping

          resource[grassColorTexture].wrapT = THREE.RepeatWrapping
          resource[grassAmbientOccluTexture].wrapT = THREE.RepeatWrapping
          resource[grassNormalTexture].wrapT = THREE.RepeatWrapping
          resource[grassRoughnessTexture].wrapT = THREE.RepeatWrapping

          floor.position.set(0,0,0)
          house.add(floor)


          let ambientLight =  new THREE.AmbientLight("#ffffff",0.5)
          gui.add(ambientLight,'intensity').min(0).max(1).step(0.001)
          scene.add(ambientLight)
         
         

          let light =new THREE.DirectionalLight("#b9d5ff",0.5)
          light.position.set(4,5,-2)
          light.lookAt(house.position)
          light.shadow.mapSize.width = 10
          light.shadow.mapSize.height =10
          light.shadow.camera.near = 10
          light.shadow.camera.far =30
          light.castShadow = true
         
    
          gui.add(light,'intensity').min(0).max(1).step(0.01)
          gui.add(light.position,'x').min(-5).max(5).step(0.001)
          gui.add(light.position,'y').min(-5).max(5).step(0.001)
          gui.add(light.position,'z').min(-5).max(5).step(0.001)
          scene.add(light) 


          let doorlight =new  THREE.PointLight('#ff7d46',1,7)
          doorlight.castShadow =true
          doorlight.position.set(0,2.2,2.7)
          doorlight.shadow.mapSize.width =256
          doorlight.shadow.mapSize.height =256
          doorlight.shadow.camera.far =7
          house.add(doorlight)

         



          



          const walls = new THREE.Mesh(
              new THREE.BoxBufferGeometry(4,2.5,4),
              new THREE.MeshStandardMaterial({
                map:resource[bricksColorTexture],
                aoMap:resource[bricksAmbientOccluTexture],
                normalMap:resource[bricksNormalTexture],
                roughnessMap:resource[bricksRoughnessTexture],
            })
          )
          walls.position.y =  1.25
          walls.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2)
          )
          walls.castShadow =true
          house.add(walls)



        let  roof = new THREE.Mesh(
            new THREE.ConeBufferGeometry(3.5,1,4),
            new THREE.MeshStandardMaterial({
                color:"#b35f45"
            })
        )
        roof.position.y = 3
        roof.rotation.y = Math.PI*0.25
        house.add(roof)



       let door  = new THREE.Mesh(
           new THREE.PlaneBufferGeometry(2,2,100,100),
           new THREE.MeshStandardMaterial({
               map:resource[doorColorTextTure],
               transparent:true,
               alphaMap:resource[doorAlphaTextTure],
               aoMap:resource[doorAmbientOccluTextTure],
               displacementMap:resource[doorHeightTextTure],
               displacementScale:0.1,
               normalMap:resource[doorNormalTextTure],
               metalnessMap:resource[doorMetalnessTextTure],
               roughnessMap:resource[doorRoughnessTexture],
           })
       )
       door.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2)
       )
       door.position.z =2+0.01
       door.position.y =1
       house.add(door)

      
       const bushGeomerty = new THREE.SphereGeometry(1,16,16)
    const  bushMaterial = new THREE.MeshStandardMaterial({
        color:"#89c854"
    })

       let bush1 = new THREE.Mesh(bushGeomerty,bushMaterial)
       bush1.scale.set(0.5,0.5,0.5)
       bush1.position.set(0.8,0.2,2.2)
       bush1.castShadow = true
       house.add(bush1)

       let bush2 = new THREE.Mesh(bushGeomerty,bushMaterial)
       bush2.scale.set(0.25,0.25,0.25)
       bush2.position.set(1.4,0.1,2.1)
       bush2.castShadow = true
       house.add(bush2)

       let bush3 = new THREE.Mesh(bushGeomerty,bushMaterial)
       bush3.scale.set(0.4,0.4,0.4)
       bush3.position.set(-0.8,0.1,2.2)
       bush3.castShadow = true
       house.add(bush3)
    
       let bush4 = new THREE.Mesh(bushGeomerty,bushMaterial)
       bush4.scale.set(0.15,0.15,0.15)
       bush4.position.set(-1,0.05,2.6)
       bush4.castShadow = true
       house.add(bush4)

       let graves = new THREE.Group()
       scene.add(graves)



       let graveGeomerty = new THREE.BoxBufferGeometry(0.6,0.8,0.2)
       let graveMaterial  = new THREE.MeshStandardMaterial({color:"#b2b6b1"})


       for(let i=0;i<50;i++)
       {
    let angle = Math.random()*Math.PI*2
    const radius = 3 +Math.random()*6
    const x=  Math.sin(angle)*radius
    const z = Math.cos(angle)*radius
    let grave = new THREE.Mesh(graveGeomerty,graveMaterial)
    grave.position.set(x,0.3,z)
    grave.rotation.y = (Math.random()-0.5)*0.4
    grave.rotation.z = (Math.random()-0.5)*0.4
    grave.castShadow =true
    graves.add(grave)
       }

        ghost1 = new THREE.PointLight("#ff00ff",2,3)
        ghost1.castShadow = true
        ghost1.shadow.mapSize.width =256
        ghost1.shadow.mapSize.height =256
        ghost1.shadow.camera.far =7
       scene.add(ghost1)
        ghost2 = new THREE.PointLight("#00ffff",2,3)
        ghost2.shadow.mapSize.width =256
        ghost2.shadow.mapSize.height =256
        ghost2.shadow.camera.far =7
        ghost2.castShadow = true
       scene.add(ghost2)
        ghost3 = new THREE.PointLight("#ffff00",2,3)
        ghost3.castShadow = true
        ghost3.shadow.mapSize.width =256
        ghost3.shadow.mapSize.height =256
        ghost3.shadow.camera.far =7
       scene.add(ghost3)




       


     }
    
     function init(params) {
         scene = new THREE.Scene()
        
         fog = new THREE.Fog("#262837",1,25)
         scene.fog = fog
    
         camera = new THREE.PerspectiveCamera(45,1,0.1,2000)
         camera.position.x  =0
         camera.position.y = 1
         camera.position.z = 5
         camera.lookAt(new THREE.Vector3())
    
         house = new THREE.Group()
         scene.add(house)


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
  
                addHouse(arr) 
             }
         )
        
         renderer = new THREE.WebGLRenderer()
         renderer.setPixelRatio(width/height)
         renderer.setSize(width,height)
         renderer.setClearColor("#262837")
         renderer.shadowMap.enabled = true
         renderer.shadowMap.type = THREE.PCFSoftShadowMap
         
         container.appendChild(renderer.domElement)
     
     
         controls = new PointerLockControls( camera, document.body );
         container.addEventListener( 'click', function () {
            controls.lock();
          });
         scene.add(controls.getObject() );
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
                <div id="House">
                  
                </div>
            )
        }
    
    componentWillUnmount(){
        this.leavePage()
    }
    
    }