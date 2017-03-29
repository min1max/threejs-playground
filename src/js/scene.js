'use strict';

const THREE = require('three');

require('./controls/OrbitControls');

require('./objects3D/BackgroundStarsObject3D');


var viewScene = (function () {

		var camera, scene, renderer;

		var controls;
		var group;

		var baseColor = 0x333333;
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


		//var groupOfLinesAndParticles = [];


	function init(){
			scene = new THREE.Scene();

			camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );

			//camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, radius * 100 );
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

/*			var geometry = new THREE.SphereGeometry( 5, 32, 32 );
			var material = new THREE.MeshBasicMaterial( {color: baseColor} );
			var sphere = new THREE.Mesh( geometry, material );
			sphere.name = "velika";
			sphere.position.set(50,10,10);
			scene.add( sphere );

			var geometry2 = new THREE.SphereGeometry( 4, 32, 32 );
			var material2 = new THREE.MeshBasicMaterial( {color: baseColor} );
			var sphere2 = new THREE.Mesh( geometry2, material2 );
			sphere2.position.set(10,10,10);
			sphere2.name = "mala";
			scene.add( sphere2 );		*/	

			


			var segments = maxParticleCount * maxParticleCount;
			positions = new Float32Array( segments * 3 );
			colors = new Float32Array( segments * 3 );

			var pMaterial = new THREE.PointsMaterial( {
				color: 0xFFFFFF,
				size: 4,
				blending: THREE.AdditiveBlending,
				//transparent: true,
				sizeAttenuation: false
			} );
			particles = new THREE.BufferGeometry();
			particlePositions = new Float32Array( maxParticleCount * 3 );
			for ( var i = 0; i < maxParticleCount; i++ ) {
				var x = Math.random() * r - r / 2;
				var y = Math.random() * r - r / 2;
				var z = Math.random() * r - r / 2;
				particlePositions[ i ] = x;
				particlePositions[ i ] = y;
				particlePositions[ i ] = z;
				// add it to the geometry
				particlesData.push( {
					velocity: new THREE.Vector3( -1 + Math.random() * 2, -1 + Math.random() * 2,  -1 + Math.random() * 2 ),
					numConnections: 0
				} );
			}
			particles.setDrawRange( 0, particleCount );
			particles.addAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setDynamic( true ) );

			// create the particle system
			pointCloud = new THREE.Points( particles, pMaterial );
			group.add( pointCloud );
			
			var geometry = new THREE.BufferGeometry();
			geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setDynamic( true ) );
			geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setDynamic( true ) );
			geometry.computeBoundingSphere();
			geometry.setDrawRange( 0, 0 );
			/*var material = new THREE.LineBasicMaterial( {
				vertexColors: THREE.VertexColors,
				blending: THREE.AdditiveBlending,
				transparent: true
			} );*/
			var material = new THREE.MeshBasicMaterial( {color: baseColor} );
			//linesMesh = new THREE.LineSegments( geometry, material );
			linesMesh = new THREE.Line( geometry );
			group.add( linesMesh );
			group.name = "line";

			scene.add( group );

			//setupBackground();
			//
			//console.log(scene.children[1].children);
			




			renderer.domElement.addEventListener( 'mousemove', onMouseMove, false );
			window.addEventListener( 'resize', onWindowResize, false );

	}

	function movingLines(){


		
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


		var intersects = raycaster.intersectObjects( group.children, true );
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

				var vertexpos = 0;
				var colorpos = 0;
				var numConnected = 0;
				for ( var i = 0; i < particleCount; i++ )
					particlesData[ i ].numConnections = 0;
				for ( i = 0; i < particleCount; i++ ) {
					// get the particle
					var particleData = particlesData[i];
					particlePositions[ i * 3     ] += particleData.velocity.x;
					particlePositions[ i * 3 + 1 ] += particleData.velocity.y;
					particlePositions[ i * 3 + 2 ] += particleData.velocity.z;
					if ( particlePositions[ i * 3 + 1 ] < -rHalf || particlePositions[ i * 3 + 1 ] > rHalf )
						particleData.velocity.y = -particleData.velocity.y;
					if ( particlePositions[ i * 3 ] < -rHalf || particlePositions[ i * 3 ] > rHalf )
						particleData.velocity.x = -particleData.velocity.x;
					if ( particlePositions[ i * 3 + 2 ] < -rHalf || particlePositions[ i * 3 + 2 ] > rHalf )
						particleData.velocity.z = -particleData.velocity.z;
					if ( effectController.limitConnections && particleData.numConnections >= effectController.maxConnections )
						continue;
					// Check collision
					for ( var j = i + 1; j < particleCount; j++ ) {
						var particleDataB = particlesData[ j ];
						if ( effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections )
							continue;
						var dx = particlePositions[ i * 3     ] - particlePositions[ j * 3     ];
						var dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
						var dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
						var dist = Math.sqrt( dx * dx + dy * dy + dz * dz );
						if ( dist < effectController.minDistance ) {
							particleData.numConnections++;
							particleDataB.numConnections++;
							var alpha = 1.0 - dist / effectController.minDistance;
							positions[ vertexpos++ ] = particlePositions[ i * 3     ];
							positions[ vertexpos++ ] = particlePositions[ i * 3 + 1 ];
							positions[ vertexpos++ ] = particlePositions[ i * 3 + 2 ];
							positions[ vertexpos++ ] = particlePositions[ j * 3     ];
							positions[ vertexpos++ ] = particlePositions[ j * 3 + 1 ];
							positions[ vertexpos++ ] = particlePositions[ j * 3 + 2 ];
							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;
							numConnected++;
						}
					}
				}
				linesMesh.geometry.setDrawRange( 0, numConnected * 2 );
				linesMesh.geometry.attributes.position.needsUpdate = true;
				linesMesh.geometry.attributes.color.needsUpdate = true;
				pointCloud.geometry.attributes.position.needsUpdate = true;

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
  		movingLines();
  		//setupBackground(); 

  	}

  };

})();

module.exports = viewScene.view();