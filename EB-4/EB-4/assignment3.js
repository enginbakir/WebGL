"use strict";

var canvas;
var gl;
var program;
var particleBuffer;
var bufferName, bufferSurname, nameVertices, surnameVertices;
var bufferSquare, squareVertices;
var vPosition;

var transformationMatrix, transformationMatrixLoc;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var normalMatrix, normalMatrixLoc;

var rotX = 0;
var rotY = 0;
var rotZ = 0;
var pos3 = vec3(0,0,0);
var scale3 = vec3(1,1,1);

var eye;
var at;
const up = vec3(0.0, 1.0, 0.0);
var near = 1.0;
var far = 10.0;
var eyeX = 0;
var eyeY = 0;
var eyeZ = 100.0;
var tarX = 0;
var tarY = 0;
var tarZ = 0;
var fovy = 80.0;
var aspect = 1; 
var colors = vec4(0.0, 0.0, 0.0, 1.0);



window.onload = function init()
{

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    //aspect =  canvas.width/canvas.height
    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram( program );

    // Make the letters

    squareVertices = [
    vec3(-2, -2, 2),
    vec3(2, -2, 2),
    vec3(-2, -2, -2),
    vec3(2, -2, -2)
    ];
    

    nameVertices = [
        vec3(-0.6, 0.4,0.0),//1
        vec3(-0.2, 0.4,0.0),//2
        vec3(-0.2, 0.3,0.0),//3
        vec3(-0.5, 0.3,0.0),//4
        vec3(-0.6, 0.4,0.0),//1
        vec3(-0.6, 0.1,0.0),//5
        vec3(-0.5, 0.1,0.0),//6
        vec3(-0.5, 0.0,0.0),//7
        vec3(-0.2, 0.0,0.0),//8
        vec3(-0.2, 0.1,0.0),//9
        vec3(-0.5, 0.1,0.0),//6
        vec3(-0.6, 0.0,0.0),//10
        vec3(-0.6, -0.3,0.0),//11
        vec3(-0.5, -0.3,0.0),//12
        vec3(-0.5, -0.2,0.0),//13
        vec3(-0.2, -0.3,0.0),//14
        vec3(-0.2, -0.2,0.0),//15
        vec3(-0.5, -0.2,0.0),//13
    ];

    /*surnameVertices = [
        vec3(0.2, -0.3,0.0),//2
        vec3(0.2, 0.4,0.0),//1     
        vec3(0.3, -0.3,0.0),//3
        vec3(0.3, 0.4,0.0),//4
        vec3(0.3, 0.3,0.0),//5
        vec3(0.4, 0.4,0.0),//6
        vec3(0.4, 0.3,0.0),//7
        vec3(0.6, 0.3,0.0),//8
        vec3(0.5, 0.3,0.0),//9
        vec3(0.6, 0.1,0.0),//10
        vec3(0.5, 0.1,0.0),//11
        vec3(0.4, 0.0,0.0),//12
        vec3(0.4, 0.1,0.0),//13
        vec3(0.3, 0.0,0.0),//14
        vec3(0.3, 0.1,0.0),//15
        vec3(0.6, 0.0,0.0),//16
        vec3(0.5, 0.0,0.0),//17
        vec3(0.5, -0.2,0.0),//18
        vec3(0.6, 0.0,0.0),//19
        vec3(0.6, -0.2,0.0),//20
        vec3(0.5, -0.2,0.0),//21
        vec3(0.4, -0.3,0.0),//22
        vec3(0.4, -0.2,0.0),//23
        vec3(0.3, -0.3,0.0),//24
        vec3(0.3, -0.2,0.0),//25  
    ];*/



    surnameVertices = [
        vec3(0.0, -0.3,0.2),//2
        vec3(0.0, 0.4,0.2),//1     
        vec3(0.0, -0.3,0.3,),//3
        vec3(0.0, 0.4,0.3),//4
        vec3(0.0, 0.3,0.3),//5
        vec3(0.0, 0.4,0.4),//6
        vec3(0.0, 0.3,0.4),//7
        vec3(0.0, 0.3,0.6),//8
        vec3(0.0, 0.3,0.5),//9
        vec3(0.0, 0.1,0.6),//10
        vec3(0.0, 0.1,0.5),//11
        vec3(0.0, 0.0,0.4),//12
        vec3(0.0, 0.1,0.4),//13
        vec3(0.0, 0.0,0.3),//14
        vec3(0.0, 0.1,0.3),//15
        vec3(0.0, 0.0,0.6),//16
        vec3(0.0, 0.0,0.5),//17
        vec3(0.0, -0.2,0.5),//18
        vec3(0.0, 0.0,0.6),//19
        vec3(0.0, -0.2,0.6),//20
        vec3(0.0, -0.2,0.5),//21
        vec3(0.0, -0.3,0.4),//22
        vec3(0.0, -0.2,0.4),//23
        vec3(0.0, -0.3,0.3),//24
        vec3(0.0, -0.2,0.3),//25  
    ];



    
    bufferSquare = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferSquare);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(squareVertices),gl.STATIC_DRAW);

    // Load the data into the GPU
    bufferName = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferName );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(nameVertices), gl.STATIC_DRAW );

    // Load the data into the GPU
    bufferSurname = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferSurname );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(surnameVertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    transformationMatrixLoc = gl.getUniformLocation(program, "transformationMatrix");

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );  

    document.getElementById("fovySlider").oninput = function(event) {
        fovy = event.target.value;
    };    
    document.getElementById("inp_objX").oninput = function(event) {
        //TODO: fill here to adjust translation according to slider value
		pos3[0] = event.target.value;
    };
    document.getElementById("inp_objY").oninput = function(event) {
        //TODO: fill here to adjust translation according to slider value
		pos3[1] = event.target.value;
    };
    document.getElementById("inp_objZ").oninput = function(event) {
        //TODO: fill here to adjust translation according to slider value
        pos3[2] = event.target.value;
    };
    document.getElementById("inp_obj_scaleX").oninput = function(event) {
        //TODO: fill here to adjust scale according to slider value
        scale3[0] = event.target.value;      
    };
    document.getElementById("inp_obj_scaleY").oninput = function(event) {
        //TODO: fill here to adjust scale according to slider value
        scale3[1] = event.target.value;       
    };
    document.getElementById("inp_obj_scaleZ").oninput = function(event) {
        //TODO: fill here to adjust scale according to slider value
        scale3[2] = event.target.value;       
    };
    document.getElementById("inp_rotationX").oninput = function(event) {
        //TODO: fill here to adjust rotation according to slider value
        rotX = event.target.value;      
    };
    document.getElementById("inp_rotationY").oninput = function(event) {
        //TODO: fill here to adjust rotation according to slider value
        rotY = event.target.value;      
    };
    document.getElementById("inp_rotationZ").oninput = function(event) {
        //TODO: fill here to adjust rotation according to slider value
		rotZ = event.target.value;		
    };
    document.getElementById("redSlider").oninput = function(event) {
        //TODO: fill here to adjust color according to slider value
        colors[0] = event.target.value;		
    };
    document.getElementById("greenSlider").oninput = function(event) {
        //TODO: fill here to adjust color according to slider value
        colors[1] = event.target.value;		
    };
    document.getElementById("blueSlider").oninput = function(event) {
        //TODO: fill here to adjust color according to slider value
        colors[2] = event.target.value;	
    };
    document.getElementById("inp_camX").onchange = function(event) {
        eyeX = event.target.value*30;
    };
    document.getElementById("inp_camY").onchange = function(event) {
        eyeY = event.target.value*30;
    };
    document.getElementById("inp_camZ").onchange = function(event) {
        eyeZ = event.target.value*30;
    };
    document.getElementById("inp_tarX").onchange = function(event) {
        tarX = event.target.value/4;
    };
    document.getElementById("inp_tarY").onchange = function(event) {
        tarY = event.target.value/4;
    };
    document.getElementById("inp_tarZ").onchange = function(event) {
        tarZ = event.target.value/4;
    };


    //square();
    render();

};

function drawSquare(){
 
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferSquare);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP,0, 4);
}
function render() {
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    

    eye = vec3(eyeX, eyeY, eyeZ);
    at = vec3(tarX, tarY, tarZ);
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    //gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix));   
    
    drawSquare();
    
    gl.uniform4fv(gl.getUniformLocation(program, "colors"), flatten(colors));

    /*transformationMatrix = mat4();
    transformationMatrix = mult(transformationMatrix, translate(pos3[0], pos3[1], pos3[2]));
    transformationMatrix = mult(transformationMatrix, scalem(scale3[0], scale3[1], scale3[2]));
    transformationMatrix = mult(transformationMatrix, rotate(rotZ, 0, 0, 1)); */

    modelViewMatrix = mult(modelViewMatrix, translate(pos3[0],pos3[1],pos3[2]));
    modelViewMatrix = mult(modelViewMatrix, rotate(rotX, 1, 0, 0 ));
    modelViewMatrix = mult(modelViewMatrix, rotate(rotY, 0, 1, 0 ));
    modelViewMatrix = mult(modelViewMatrix, rotate(rotZ, 0, 0, 1 ));
    modelViewMatrix = mult(modelViewMatrix, scalem(scale3[0],scale3[1],scale3[2]));
    
    normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
   

   // gl.uniformMatrix4fv( normalMatrixLoc, false,flatten(normalMatrix) );
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferName);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 18);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferSurname);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 25);   


    window.requestAnimFrame(render);

}