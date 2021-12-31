import React, { Component } from 'react'
    import * as THREE from 'three'
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
    import "./Physics.css"
    import * as CANNON  from 'cannon-es';
    import * as dat from "dat.gui"
    export default class Physics extends Component {
    initThree(){
     let scene 
     let camera
     let renderer
     let group
     const baseUrl = '/textures/environmentMaps'
     const px0 = baseUrl+"/0/px.png";
     const nx0 = baseUrl+"/0/nx.png";
     const py0 = baseUrl+"/0/py.png";
     const ny0 = baseUrl+"/0/ny.png";
     const pz0 = baseUrl+"/0/pz.png";
     const nz0 = baseUrl+"/0/nz.png";

     const px1 = baseUrl+"/1/px.png";
     const nx1 = baseUrl+"/1/nx.png";
     const py1 = baseUrl+"/1/py.png";
     const ny1 = baseUrl+"/1/ny.png";
     const pz1 = baseUrl+"/1/pz.png";
     const nz1 = baseUrl+"/1/nz.png";

     const px2 = baseUrl+"/2/px.png";
     const nx2 = baseUrl+"/2/nx.png";
     const py2 = baseUrl+"/2/py.png";
     const ny2 = baseUrl+"/2/ny.png";
     const pz2 = baseUrl+"/2/pz.png";
     const nz2 = baseUrl+"/2/nz.png";

     const px3 = baseUrl+"/3/px.png";
     const nx3 = baseUrl+"/3/nx.png";
     const py3 = baseUrl+"/3/py.png";
     const ny3 = baseUrl+"/3/ny.png";
     const pz3 = baseUrl+"/3/pz.png";
     const nz3 = baseUrl+"/3/nz.png";

     const px4 = baseUrl+"/4/px.png";
     const nx4 = baseUrl+"/4/nx.png";
     const py4 = baseUrl+"/4/py.png";
     const ny4 = baseUrl+"/4/ny.png";
     const pz4 = baseUrl+"/4/pz.png";
     const nz4 = baseUrl+"/4/nz.png";
     let resArray={
        texture:[
            px0,
            nx0,
            py0,
            ny0,
            pz0,
            nz0,
            px1,
            nx1,
            py1,
            ny1,
            pz1,
            nz1,
            px2,
            nx2,
            py2,
            ny2,
            pz2,
            nz2,
            px3,
            nx3,
            py3,
            ny3,
            pz3,
            nz3,
            px4,
            nx4,
            py4,
            ny4,
            pz4,
            nz4,   
        ],
        gltf:[],
        font:[],
    }
    let toggleTip =getLoadingfn()
    let hasLoadedNum = 0
    let totalLoadedResNum = 0
    const gui = new dat.GUI()
    const debugObject ={}
    // const hitSound  = new Audio('./sounds/hit.map3')
    // const playHitSound = ()=>{
    //     hitSound.play()
    // }
     for(let attr in resArray)
     {
         totalLoadedResNum+=resArray[attr].length
     }
    let container = document.getElementById("PhysicsContainer")
     let width = container.clientWidth
     let height = container.clientHeight
     let leave =false
     let controls
     const world = new CANNON.World()
     world.broadphase = new CANNON.SAPBroadphase(world)
     world.allowSleep = true
     world.gravity.set(0,-9.82,0)
     const objectsArray = []
    //  const plasticMaterial = new CANNON.Material('plastic')
    //  const concreteMaterial = new CANNON.Material('concrete')  
     const defaultMaterial = new CANNON.Material('default')
     const concretePlasticContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
         {
             friction:0.1,
             restitution:0.7,
         }
     )
     world.addContactMaterial(concretePlasticContactMaterial)

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
     let oldElapsedTime = 0
     let plane
     let planeBody

     
     
     
    const createSphere = (radius,position)=>{
            const mesh = new THREE.Mesh(
                new THREE.SphereBufferGeometry(radius,20,20),
                new THREE.MeshStandardMaterial({
                    metalness:0.3,
                    roughness:0.4,
                    color:'white',
                })
            )  
            mesh.castShadow = true
            mesh.position.copy(position)
            scene.add(mesh)

            const shape = new CANNON.Sphere(radius)
            const body = new CANNON.Body({
                mass:1,
                position:new CANNON.Vec3(0,3,0),
                shape,
                material:defaultMaterial

            })
            body.position.copy(position)
            world.addBody(body)
             objectsArray.push({
                mesh,
                body
            })
     }

     const createBox = (width,height,depth,position)=>{
        const mesh = new THREE.Mesh(
            new THREE.BoxBufferGeometry(width,height,depth),
            new THREE.MeshStandardMaterial({
                metalness:0.3,
                roughness:0.4,
                color:'white',
            })
        )  
        mesh.castShadow = true
        mesh.position.copy(position)
        scene.add(mesh)

        const shape = new CANNON.Box(new CANNON.Vec3(width*0.5,height*0.5,depth*0.5))
        const body = new CANNON.Body({
            mass:1,
            position:new CANNON.Vec3(0,3,0),
            shape,
            material:defaultMaterial

        })
        body.position.copy(position)
         
        //  body.addEventListener('collide',playHitSound)
        world.addBody(body)
         objectsArray.push({
            mesh,
            body
        })
 }

     debugObject.createSphere = ()=>{
        createSphere(Math.random()*0.5,{
            x:(Math.random() -0.5)*3,
            y:(Math.random()+1)*3,
            z:(Math.random() -0.5)*3
        })
    }
    gui.add(debugObject,'createSphere')

    debugObject.createBox = ()=>{
        createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x:(Math.random() -0.5)*3,
            y:(Math.random()+1)*3,
            z:(Math.random() -0.5)*3
        })
    }
    gui.add(debugObject,'createBox')

   
    debugObject.reset = () =>{
        for(const x of objectsArray)
        {
             world.removeBody(x.body)
               
             scene.remove(x.mesh)
        }
    }

    gui.add(debugObject,'reset')

  

     function render(params) {
         const t  = clock.getElapsedTime()
         const delta = t - oldElapsedTime
         oldElapsedTime  =t
       
        if(objectsArray.length)
        { 
            world.step(1/60,delta,3)
        //     sphere.position.x= sphereBody.position.x
        // sphere.position.y= sphereBody.position.y
        // sphere.position.z= sphereBody.position.z
        //   sphereBody.applyForce(new CANNON.Vec3(-0.5,0,0),sphereBody.position)     
        //  let cc =0     
        for(let x of objectsArray)
             {
                 const {mesh,body} = x
                //  if(force===0)
                //  {
                //       cc++
                      
                //       if(cc===5)
                //       {
                //           console.log('停')
                //       }
                //  }
                 mesh.position.x = body.position.x
                 mesh.position.y = body.position.y
                 mesh.position.z = body.position.z
                 mesh.quaternion.copy(body.quaternion)
                //  body.applyForce(new CANNON.Vec3(-force,0,0),body.position)
                //  if(x.force>0)
                //  {
                //       x.force-=0.1
                //  }else{
                //      x.force = 0
                //  }
                
             }

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
        //    const sphereShape = new CANNON.Sphere(0.5)
        //     sphereBody = new CANNON.Body({
        //        mass:1,
        //        position:new CANNON.Vec3(0,3,0),
        //        shape:sphereShape,
        //        material:plasticMaterial
        //    })

          // sphereBody.applyLocalForce(new CANNON.Vec3(-500,0,-500),new CANNON.Vec3(0,0,0))
          
        //   for(let i=0;i<5;i++)
        //   {
        //       setTimeout(()=>{
        //           createSphere(0.5,{x:0,y:1+i,z:0})
        //       },i*1000);
        //   }
          

           const planeShape =  new CANNON.Plane()
           planeBody = new CANNON.Body({
               shape:planeShape,
               material:defaultMaterial
           })
           planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1,0,0),Math.PI*0.5)
           planeBody.mass =0
           
           //world.addBody(sphereBody)
           world.addBody(planeBody)

              plane = new THREE.Mesh(new THREE.PlaneGeometry(10,10),new THREE.MeshStandardMaterial({
               color:'#777777',
               metalness:0.3,
                roughness:0.4,
               side:THREE.DoubleSide
           }))
           plane.receiveShadow =true
           plane.rotation.x = - Math.PI /2
           scene.add(plane)

        //     sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5,32,32),new THREE.MeshStandardMaterial(
        //        {
        //            color:'white',
        //            metalness:0.3,
        //            roughness:0.4,
        //            envMap:resource[px0],
        //        }
        //    ))
        //    sphere.castShadow = true
        //   sphere.position.set(-1,10.5,0)
        //   scene.add(sphere) 


          scene.add(new THREE.AxesHelper())
        


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
    
         group = new THREE.Group()
         scene.add(group)

          scene.add(new THREE.AmbientLight(0xffffff,0.7))

         const light1 = new THREE.DirectionalLight(0xffffff,0.2)
         light1.position.set(5,5,5)
         light1.lookAt(new THREE.Vector3(0,0,0))
         light1.castShadow =true
         scene.add(light1)
    
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
         renderer.shadowMap.enabled = true
       //  renderer.shadowMap.type = THREE.PCFSoftShadowMap
         
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
                <div id="PhysicsContainer">
                  
                </div>
            )
        }
    
    componentWillUnmount(){
        this.leavePage()
    }
    
    }