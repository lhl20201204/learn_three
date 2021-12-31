import React, { Component } from 'react'
    import * as THREE from 'three'
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import "./ThreeText.css"
    import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
    export default class ThreeText extends Component {
    initThree(){
     let scene 
     let camera
     let renderer
     let group
     let text
     let lineText
     let container = document.getElementById("ThreeText")
     let width = container.clientWidth
     let height = container.clientHeight
     let leave = false
     let count =0
    
     function leavePage(params) {
        leave = true
     }
     function render(params) {
        group.rotation.y -= 0.005;
        count++
        if(count%30===0&&text)
        {
            text.material.color.set(0xffffff*Math.random())
        }
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
    

         let mesh = new THREE.Mesh(new THREE.BoxGeometry(100,100,60),new THREE.MeshBasicMaterial({
             wireframe:true
         }))
         group.add(mesh)


         const fontLoader =new FontLoader()
         fontLoader.load('./helvetiker_regular.typeface.json',(font)=>{
            const color = 0xff0000;

            const matDark = new THREE.LineBasicMaterial( {
                color: color,
                side: THREE.DoubleSide
            } );

            const matLite = new THREE.MeshBasicMaterial( {
                color: color,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide,
            } );

            const message = 'hello world';

            const shapes = font.generateShapes( message, 30 );

            const geometry = new THREE.ShapeGeometry( shapes );

            geometry.computeBoundingBox();

            const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );

            geometry.translate( xMid, 0, 0 );

            // make shape ( N.B. edge view not visible )

             text = new THREE.Mesh( geometry, matLite );
            text.position.z = - 150;
             group.add(text)


					const holeShapes = [];

					for ( let i = 0; i < shapes.length; i ++ ) {

						const shape = shapes[ i ];

						if ( shape.holes && shape.holes.length > 0 ) {

							for ( let j = 0; j < shape.holes.length; j ++ ) {

								const hole = shape.holes[ j ];
								holeShapes.push( hole );

							}

						}

					}

					shapes.push.apply( shapes, holeShapes );

					 lineText = new THREE.Object3D();

					for ( let i = 0; i < shapes.length; i ++ ) {

						const shape = shapes[ i ];

						const points = shape.getPoints();
						const geometry = new THREE.BufferGeometry().setFromPoints( points );

						geometry.translate( xMid, 0, 0 );

						const lineMesh = new THREE.Line( geometry, matDark );
						lineText.add( lineMesh );

					}
                    group.add(lineText)
         })

         const axesHelper = new THREE.AxesHelper(500)
         scene.add(axesHelper)

        let loader = new THREE.TextureLoader()
        
        new Promise((res,rej)=>{
            loader.load("./logo192.png",(texture)=>{
                res(texture)
            })
        }).then(texture=>{
 const donutGeomerty = new THREE.TorusBufferGeometry(0.3,0.2,20,45)
         const donutMaterial = new THREE.MeshMatcapMaterial({map:texture,side:THREE.DoubleSide})
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
                <div id="ThreeText">
                  
                </div>
            )
        }
    
    componentWillUnmount(){
        this.leavePage()
    }
    
    }