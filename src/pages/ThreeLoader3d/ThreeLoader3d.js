import React, { Component } from 'react'
import * as THREE from "three"
import "./ThreeLoader3d.css"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
export default class ThreeLoader3d extends Component {
    componentDidMount()
    {
        this.leavePage = this.initThree()
    }

     initThree(){
         let scene 
         let group
         let camera
         let loader 
         let leave =false
         let container  = document.querySelector("#load3d")
         let width  =container.clientWidth
         let height = container.clientHeight
         let render 


    function leavePage(){
          leave =true
     }

     function setRender(){
        render = new THREE.WebGLRenderer()
       render.setClearColor(0xffffff)
       render.setPixelRatio(width/height)
        render.setSize(width,height)
        container.appendChild(render.domElement)
     }  

     function init(){
         scene = new THREE.Scene()
        group = new THREE.Group()
        
        camera = new THREE.PerspectiveCamera( 60, width / height, 1, 2000 );
	 camera.position.x = -10;
    camera.position.y = 15;
	 camera.position.z = 500;
	 camera.lookAt( scene.position );

         scene.add(group)

    


      let geometry = new THREE.RingGeometry(100,200)
      let material = new THREE.MeshBasicMaterial({
          wireframe:true,
          color:"green"
      })
      let mesh= new THREE.Mesh(geometry,material)
      group.add(mesh)


      let light = new THREE.AmbientLight('white')
      scene.add(light)
  
      loader = new GLTFLoader()
      loader.load("./plane.gltf",(model)=>{
          console.log(model.scene)
          model.scene.scale.x =150
          model.scene.scale.y =150
          model.scene.scale.z =150
          //model.scene.children[0].material.wireframe=true
        group.add(model.scene)
      })


     setRender()

    let controls = new OrbitControls(camera, render.domElement);
     controls.update();
     }
     function renderTo(){
         group.rotation.y+=0.01
        render.render( scene, camera );
     }

     function animate(){
        !leave&& window.requestAnimationFrame(animate)
        renderTo()
     }
       init()
       animate()


     return leavePage
     }
    


    render() {
        return (
            <div id="load3d">
               
            </div>
        )
    }

    componentWillUnmount(){
        this.leavePage()
    }
}
