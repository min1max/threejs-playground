'use strict';
var THREE = require('three');

require('./controls/OrbitControls');


var viewScene = (function () {

		var camera, scene, renderer;

		var controls;

		var baseColor = 0x333333;
		var intersectColor = 0x00D66B;

		var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();
		var intersected;




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

			var group = new THREE.Group();
			scene.add( group );

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
			group.add( sphere );

			var geometry2 = new THREE.SphereGeometry( 4, 32, 32 );
			var material2 = new THREE.MeshBasicMaterial( {color: baseColor} );
			var sphere2 = new THREE.Mesh( geometry2, material2 );
			sphere2.position.set(10,10,10);
			sphere2.name = "mala";
			group.add( sphere2 );		*/	


				var geometry = new THREE.Geometry();
				var point = new THREE.Vector3();
				var direction = new THREE.Vector3();

				//group = new THREE.Object3D();
				var object;
				for ( var i = 0; i < 50; i ++ ) {
					direction.x += 2.5;
					direction.y += 2.5;
					direction.z += 2.5;
					//direction.normalize().multiplyScalar( 10 );
					point.add( direction );
					geometry.vertices.push( point.clone() );


				  var material = new THREE.LineBasicMaterial( {color: baseColor} );
					object = new THREE.Line( geometry, material );
					
					object.position.x = Math.random() * 40 - 20;
					object.position.y = Math.random() * 40 - 20;
					object.position.z = Math.random() * 40 - 20;

					group.add( object );
				}



			renderer.domElement.addEventListener( 'mousemove', onMouseMove, false );
			window.addEventListener( 'resize', onWindowResize, false );

			//console.log(scene.children[1].children);

	}



	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}


	function onMouseMove( event ) {

		event.preventDefault(); 

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );

		var intersects = raycaster.intersectObjects( scene.children[1].children );

		if (intersects.length > 0) {
		
					if ( intersected != intersects[ 0 ].object ) {

						if ( intersected ) intersected.material.color.setHex( baseColor );

							intersected = intersects[ 0 ].object;
							intersected.material.color.setHex( intersectColor );

					}

					document.body.style.cursor = 'pointer';
		}
		else if ( intersected ) {

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