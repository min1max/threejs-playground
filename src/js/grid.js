'use strict';

const THREE = require('three');
require('./renderer/CSS3DRenderer');
const TWEEN = require('./animation/tween.min');

import table from './json/table.json';

var viewScene = (function () {

	var camera, scene, renderer;
	var geometry, material, mesh;

	var controls;

	var photos = table.photos;

	var objects = [];

	var targets = { table: [], sphere: [], helix:[], grid: [], chemcam: [], mast: [] };

	var ww = window.innerWidth;
	var wh = window.innerHeight;

	const cam = photos.reduce(
					function (r, a) {
	        r[a.camera.name] = r[a.camera.name] || [];
	        r[a.camera.name].push(a);
	        return r;
	    }, []);

	const camsObj = Object.entries(cam);
	const len = photos.length;


			function init() {
				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.z = 3000;
				scene = new THREE.Scene();

				var helper = new THREE.AxisHelper(5);
				scene.add(helper);



				var chemcam = camsObj[4];
				var chemcamName = camsObj[4][0];
				var camImgsLen = camsObj[4][1].length;
				var chemcamImgs = camsObj[4][1];


				var mast = camsObj[5];
				var mastcamName = camsObj[5][0];
				var mastImgsLen = camsObj[5][1].length;
				var mastcamImgs = camsObj[5][1];


				var mahli = camsObj[2];
				var mahlicamName = camsObj[2][0];
				var mahliImgsLen = camsObj[2][1].length;//72
				var mahlicamImgs = camsObj[2][1];
					//console.log(mahliImgsLen);
				
					var col;
					var row;
					var cols;

					var elsWidth;
					var halfElsWidth;
					var equalW;
					var diff;

				//for ( var i = 0; i < camImgsLen; i++ ) {	
				for ( var i = 0; i < mahliImgsLen; i++ ) {	
					
					//var element = createElement(chemcamName);
					var element = createElement(mahlicamImgs[i].img_src);
					//pixeli elementa u broj
					var elWidth = Number(element.style.width.replace(/[^\d\.\-]/g, ''));
					var elHeight = Number(element.style.height.replace(/[^\d\.\-]/g, ''));

					var object = new THREE.CSS3DObject( element );
					scene.add( object );
					objects.push( object );

					var object = new THREE.Object3D();

					if ( i < 8 ){
					//define num of column & row number
					col = 4;
					row = 2; 

					cols = i % col; 


				  elsWidth = col*elWidth;
				  halfElsWidth = (col*elWidth)/2;

					//duljina jednako raspoređenih [i] od nule
				  equalW = cols+(cols*elWidth)-cols;

					//razlika za koju moram oduzeti od ishodišta
				  diff = elsWidth - (halfElsWidth/2); 
						console.log('1red: ' + equalW);

						object.position.x = equalW - (diff/2);
						object.position.y = (wh/2) +(  - ( Math.floor(i/col) % row) * elHeight ) * 2; 
						object.position.z = 0;

					}
					else if ( i > 8 && i < 30) {
						col = 6;
						row = 3; 
						cols = i % col; 
						equalW = cols+(cols*elWidth)-cols;
						halfElsWidth = (col*elWidth)/2;
						diff = elsWidth - (halfElsWidth/2); 

						object.position.x = (elWidth + (col*elWidth)/2) - equalW - (diff/2);
						object.position.y = 400 + (wh/2) +(  - ( Math.floor(i/col) % row) * elHeight ) * 2; 
						object.position.z = -elWidth;
						console.log('2red: ' + equalW);

						//console.log(i);
					}else{
						object.position.x = -2000;
					}

					targets.chemcam.push( object );

				}


				//all
				/*for ( var i = 0; i < len; i++ ) {	
					var camName = photos[i].camera.name;

					//console.log(camName);
	
					var element = createElement(camName);

					var object = new THREE.CSS3DObject( element );
					//scene.add( object );
					//objects.push( object );

				}*/

				//table
				for ( var i = 0, l = objects.length; i < l; i ++ ) {

					var item = table[ i ];
					var object = objects[ i ];

					var object = new THREE.Object3D();
					object.position.x = ( i % 10 ) - 1540;
					object.position.y = - ( (1 % 10) * 20 ) + 1100;
					targets.table.push( object );

					/*object = new THREE.Object3D();
					var col = i % 10; 
					var elemWidth = ww/10;
					var elemH = wh / 10;


					object.position.x = i +( col  * elemWidth  ) / ww;
					object.position.y = ( - ( Math.floor( i / 10 ) % 10 ) * elemWidth ) + elemH;
					targets.table.push( object );*/

				}



				renderer = new THREE.CSS3DRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.domElement.style.position = 'absolute';
				document.getElementById( 'container' ).appendChild( renderer.domElement );


				var button = document.getElementById( 'table' );
					button.addEventListener( 'click', function ( event ) {
					transform( targets.table, 2000 );
				}, false );
				var button = document.getElementById( 'chemcam' );
					button.addEventListener( 'click', function ( event ) {
					transform( targets.chemcam, 3000 );
				}, false );
				var button = document.getElementById( 'grid' );
					button.addEventListener( 'click', function ( event ) {
					transform( targets.grid, 2000 );
				}, false );

				var button = document.getElementById( 'FHAZ' );
					button.addEventListener( 'click', function ( event ) {
					transform( targets.helix, 2000 );
				}, false );

				//transform( targets.table, 2000 );
				transform( targets.chemcam, 2000 );
				window.addEventListener( 'resize', onWindowResize, false );


			}

function createElement(/*arg*/image){
	var element = document.createElement( 'div' );
	element.className = 'element';
	//element.style.width = '200px';
	//element.style.height = '200px';
	element.setAttribute("style", "width: 200px; height: 200px;");
	element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

	//var symbol = document.createElement( 'div' );
	//symbol.className = 'symbol';
	//symbol.textContent = arg;

	var imgEl = document.createElement('img');
	imgEl.src = image;
	imgEl.className = 'image';
	element.appendChild( imgEl );
	element.style.width = '400px';
	element.style.height= '400px';
	//element.appendChild( symbol );

	return element;
}


 
var network = {
	colNum: function (value, columsNum) {  
        return value % columsNum;  
  },
	rowNum: function (value, rowNum) {  
        return value % rowNum;  
  },
}



			function transform( targets, duration ) {
				TWEEN.removeAll();
				for ( var i = 0; i < objects.length; i ++ ) {
					var object = objects[ i ];
					var target = targets[ i ];
					new TWEEN.Tween( object.position )
						.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();
				}
				new TWEEN.Tween( this )
					.to( {}, duration * 2 )
					.onUpdate( render )
					.start();
			}
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
				render();
			}


			function animate() {

				requestAnimationFrame( animate );

				TWEEN.update();

			}

			function render() {

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