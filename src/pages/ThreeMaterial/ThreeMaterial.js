import React, { Component } from 'react'
import * as THREE from "three"
import "./ThreeMaterial.css"
export default class ThreeMaterial extends Component {
   componentDidMount(){
     this.leavePage=this.initThree()
    }
    initThree(){	
		//let stats;
		let camera, scene, renderer;
		let group;
		let container = document.querySelector("#ThreeMaterial")
		let width = container.clientWidth,height = container.clientHeight;
		let leave =false

		init();
		animate();
		function leavePage(){
			leave =true
		 }

        function textureLoadImage(src){
            let image = new Image() 
            image.src=src
		   let planetTexture = new THREE.Texture(image)
			image.onload=()=>{
                planetTexture.needsUpdate =true
            }
           return planetTexture
        }


        function setRender()
        {

            renderer = new THREE.WebGLRenderer();
			renderer.setClearColor( 0xffffff);
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( width, height );
        }
		function init() {
			scene = new THREE.Scene();
			group = new THREE.Group();
			scene.add( group );

			camera = new THREE.PerspectiveCamera( 60, width / height, 1, 2000 );
			camera.position.x = -10;
        	camera.position.y = 15;
			camera.position.z = 500;
			camera.lookAt( scene.position );

           let planetTexture =textureLoadImage("./logo192.png")
			let geometry = new THREE.RingBufferGeometry(100,200)
			let material = new THREE.MeshBasicMaterial( { map: planetTexture 
                ,side:THREE.DoubleSide,} );
				material.wireframe=true
			let mesh = new THREE.Mesh( geometry, material );
        
			group.add( mesh );
			

			setRender()
			container.appendChild( renderer.domElement );
			//stats = new Stats();
			//container.appendChild( stats.dom );  //增加状态信息 
			return leavePage
		}
		
		function animate() {
			!leave&&requestAnimationFrame( animate );
			render();
			//stats.update();
		}
		function render() {	
			group.rotation.y -= 0.005;  //这行可以控制地球自转
			renderer.render( scene, camera );
			
		}
		return leavePage
	}
  
    render() {
        return (
            <div id="ThreeMaterial" >
            </div>
        )
    }

	componentWillUnmount(){
		this.leavePage()
	}
}
