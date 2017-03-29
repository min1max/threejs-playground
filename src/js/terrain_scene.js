'use strict';

const THREE = require('three');

require('./controls/OrbitControls');

require('./objects3D/BackgroundStarsObject3D');


var viewScene = (function () {

		var camera, scene, renderer;

		var controls;
		var group;

		var baseColor = 0xffffff;
		var intersectColor = 0x00D66B;

		var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();
		var intersected;

		var particlesData = [];
		var positions, colors;
		var particles;
		var pointCloud;
		var particlePositions;
		var linesMesh;
		var maxParticleCount = 100;
		var particleCount = 50;
		var r = 400;
		var rHalf = r / 2;
		var effectController = {
			showDots: true,
			showLines: true,
			minDistance: 150,
			limitConnections: false,
			maxConnections: 7,
			particleCount: 28
		};
		var mesh;


		//var groupOfLinesAndParticles = [];


	function init(){
			scene = new THREE.Scene();

			//camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 40000 );

			camera = new THREE.PerspectiveCamera( 5, window.innerWidth / window.innerHeight, 1, 1000 );
			//camera.position.z = radius * 10;
			camera.position.z = 200;
			scene.add( camera );

			controls = new THREE.OrbitControls( camera );

			renderer = new THREE.WebGLRenderer();
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );

				group = new THREE.Group();
				


			// lights
			var ambient = new THREE.AmbientLight( 0x101010 );
			scene.add( ambient );

			var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
			directionalLight.position.set( 1, 1, 2 ).normalize();
			scene.add( directionalLight );

			//var geometry = new THREE.PlaneBufferGeometry( 20, 20, 32, 32 );
			var geometry = new THREE.PlaneGeometry( 20, 20, 32, 32 );
			//var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );

		  /*var material = new THREE.MeshPhongMaterial( {
		      transparent: true, opacity: 0,
		      polygonOffset: true,
		      polygonOffsetFactor: 1, 
		      polygonOffsetUnits: 1
		  } );*/

		  var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, wireframe: true} );


			scene.add( group );

			mesh = new THREE.Mesh( geometry, material );
			mesh.rotation.x = 2;
			scene.add( mesh );

			//console.log(geometry.attributes.position );
			//console.log(geometry.vertices[1].z);

			var vertices = mesh.geometry.vertices;

			//var verZ = geometry.vertices
			mesh.geometry.verticesNeedUpdate = true;

			for (var i = 0; i < vertices.length; i++ ){
				
				var X = vertices[i].x;
				var Y = vertices[i].y;
				var Z = vertices[i].z;
			
				mesh.geometry.vertices[i].set(X, Y, Z+Math.random());
				//console.log(vertices[i].z);
			}


			renderer.domElement.addEventListener( 'mousemove', onMouseMove, false );
			window.addEventListener( 'resize', onWindowResize, false );

	}


	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}


	function onMouseMove( event ) {

		//groupOfLinesAndParticles.push(group);

		event.preventDefault(); 

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );


		var intersects = raycaster.intersectObjects( scene.children, true );
		//console.log(group.children);
		//var intersects = raycaster.intersectObjects( scene.children[1].children, true );
		

		if (intersects.length > 0) {

					if ( intersected != intersects[ 0 ].object ) {

						if ( intersected ) intersected.material.color.setHex( baseColor );

							intersected = intersects[ 0 ].object;
							intersected.material.color.setHex( intersectColor );
							//console.log(intersected.name);

					}

					document.body.style.cursor = 'pointer';
		}
		else if ( intersected ) {
			console.log('intersected');

			intersected.material.color.setHex( baseColor );
			intersected = null;

			document.body.style.cursor = 'auto';

		}

	}

	function animate() {



		requestAnimationFrame( animate );
		render();
	}

	function render() {
		controls.update();
		renderer.render( scene, camera );

	}
				

  return {

  	view: function(){
  		init();
  		animate();

  	}

  };

})();

module.exports = viewScene.view();