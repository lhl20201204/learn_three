import React, { Component } from 'react'
    import * as THREE from 'three'
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import "./Light.css"
    export default class Light extends Component {
    initThree(){
     let scene 
     let camera
     let renderer
     let group
     let container = document.getElementById("Light")
     let width = container.clientWidth
     let height = container.clientHeight
     let leave =false
    
     function leavePage(params) {
        leave = true
     }
     function render(params) {
    
         renderer.render(scene,camera)
     }
    
     function  animate() {
         !leave && window.requestAnimationFrame(animate)
         render()
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

         let testLoader = new THREE.TextureLoader()
         testLoader.load("./atlas.png",(textTure)=>{
             let geometry = new THREE.PlaneGeometry(200,200)
         let material = new THREE.MeshStandardMaterial({
              map:textTure,
              side:THREE.DoubleSide
              
         })
         material.map.repeat.set(10,10)
        material.map.wrapS = THREE.RepeatWrapping
        material.map.wrapT = THREE.RepeatWrapping

         let  plane = new THREE.Mesh(geometry,material)
         group.add(plane)
         })


         

         let geometry1 = new THREE.SphereGeometry(10)
         let material1 = new THREE.MeshStandardMaterial({
             wireframe:true,
             color:"black"
         })
         let sphere = new THREE.Mesh(geometry1,material1)
         sphere.position.x=30
         sphere.position.y=30
         sphere.position.z=30
         group.add(sphere)


         let geometry2 = new THREE.BoxGeometry(20,20,20)
         let material2 = new THREE.MeshStandardMaterial({
             wireframe:true,
             color:"black"
         })
         let square = new THREE.Mesh(geometry2,material2)
         square.position.x=-30
         square.position.y=30
         square.position.z=30
         group.add(square)

        //  let ambientLight= new THREE.AmbientLight(0xffffff,0.5)
        //  ambientLight.intensity = 0.5
        //  scene.add(ambientLight)

     let loader = new THREE.TextureLoader()
         new Promise((res,rej)=>{
            loader.load("./Water_2_M_Normal.jpg",(texture)=>{
                res(texture)
            })
        }).then(texture=>{
 const donutGeomerty = new THREE.TorusBufferGeometry(0.3,0.2,20,45)
         const donutMaterial = new THREE.MeshStandardMaterial({map:texture,side:THREE.DoubleSide})
         for(let i=0;i<100;i++)
         {
           
            const donut = new THREE.Mesh(donutGeomerty,donutMaterial)

            donut.position.x = (Math.random()-0.5)*100
            donut.position.y = (Math.random()-0.5)*100
            donut.position.z = (Math.random()-0.5)*100

            donut.rotation.x = Math.random()*Math.PI
            donut.rotation.y = Math.random()*Math.PI
            donut.rotation.z = Math.random()*Math.PI

            const scale =Math.random()*10
            donut.scale.x = scale
            donut.scale.y= scale
            donut.scale.z = scale


            group.add(donut)

         }
        })


        let hemisphereLight = new THREE.HemisphereLight(0xff0000,0x00ff00,0.3)
        scene.add(hemisphereLight)


         let axesHelper = new THREE.AxesHelper(200)
         scene.add(axesHelper)
    
         renderer = new THREE.WebGLRenderer()
         renderer.setPixelRatio(width/height)
         renderer.setClearColor(0x00ff00,0.1)
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
                <div id="Light">
                  
                </div>
            )
        }
    
    componentWillUnmount(){
        this.leavePage()
    }
    
    }