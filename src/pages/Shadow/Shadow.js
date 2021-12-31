import React, { Component } from 'react'
    import * as THREE from 'three'

    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import "./Shadow.css"
    export default class Shadow extends Component {
    initThree(){
     let scene 
     let camera
     let renderer
     let group
     let sphere
    let sphereShadow
     let container = document.getElementById("Shadow")
     let width = container.clientWidth
     let height = container.clientHeight
     let leave =false
     const clock = new THREE.Clock()
    
     function leavePage(params) {
        leave = true
     }
     function render(params) {
         let time = clock.getElapsedTime()
         sphere.position.set(3*Math.cos(time)*1.5,3*Math.cos(time)*1.5,5+Math.abs(Math.sin(time)))
         //if(sphereShadow){
        //     sphereShadow.position.x = sphere.position.x
        // sphereShadow.position.z = sphere.position.z
        // sphereShadow.material.opacity =1 - sphere.position.y  
         //}
       
         renderer.render(scene,camera)
     }
    
     function  animate() {
         !leave && window.requestAnimationFrame(animate)
         render()
     }


     function lay(){
       
        let planeGeomerty = new THREE.PlaneGeometry(200,200)
        let planeMaterial = new THREE.MeshStandardMaterial({
            side:THREE.DoubleSide
        })
        let plane = new THREE.Mesh(planeGeomerty,planeMaterial)
    //plane.castShadow = true
        plane.receiveShadow =true
        group.add(plane)


        let sphereGeometry = new THREE.SphereBufferGeometry(3)
        let  sphereMatrial = new THREE.MeshStandardMaterial({
            side:THREE.DoubleSide
        })

        sphere = new THREE.Mesh(sphereGeometry,sphereMatrial)
        sphere.position.set(0,0,10)
        sphere.castShadow =true
        group.add(sphere)

       let loader = new THREE.TextureLoader()
        new Promise((res,rej)=>{
          loader.load("./floor.jpg",(t)=>{
              res(t)
          })
        }).then(texture=>{
            sphereShadow = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5,1.5),
            new THREE.MeshBasicMaterial({
                 color:0xff0000,
                 transparent:true,
                 alphaMap:texture
            })
             
          )
       sphereShadow.rotation.x = - Math.PI*0.5
        sphereShadow.position.y = plane.position.y+0.01
          group.add(sphereShadow)

        
          





        })
          

        

        

        let light =new THREE.DirectionalLight(0xffffff)
        let helper = new THREE.DirectionalLightHelper(light)
        light.shadow.mapSize.width = 1024
        light.shadow.mapSize.height =1024
        light.shadow.camera.near = 1
        light.shadow.camera.far =130
        let helper3 = new THREE.CameraHelper(light.shadow.camera)
        light.position.set(30,-10,100)
         light.castShadow = true
        scene.add(light)
        scene.add(helper)
        scene.add(helper3)


        // let light2 = new THREE.PointLight(0xff0000,1,100)
        // let helper2 = new THREE.PointLightHelper(light2,10)
        // light2.position.set(10,10,60)
        // scene.add(light2)
        // scene.add(helper2)
     }
    
     function init(params) {
         scene = new THREE.Scene()
       
    
         camera = new THREE.PerspectiveCamera(45,1,0.1,2000)
         camera.position.x  =-10
         camera.position.y = 15
         camera.position.z = 500
         camera.lookAt(camera.position)
    
         group = new THREE.Group()
         scene.add(group)
        lay()
         renderer = new THREE.WebGLRenderer()
         renderer.setPixelRatio(width/height)
         renderer.setClearColor(0x000000)
         renderer.setSize(width,height)
         renderer.shadowMap.enabled = true;
         renderer.shadowMap.type = THREE.BasicShadowMap; 
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
                <div id="Shadow">
                  
                </div>
            )
        }
    
    componentWillUnmount(){
        this.leavePage()
    }
    
    }