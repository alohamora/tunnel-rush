function initObsBuffers2(gl) {

    // Create a buffer for the cube's vertex positions.
  
    const positionBuffer = gl.createBuffer();
  
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
  
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    // Now create an array of positions for the cube.
    var v1 = 3*Math.sin(((360.0/16.0)*Math.PI)/180.0);
    var v2 = 3*Math.cos(((360.0/16.0)*Math.PI)/180.0);
    const positions = [
        v1,-v2,0.0,
        -v1,-v2,0.0,
        0.0, 0.0, 0.0,

        v1,v2,0.0,
        -v1,v2,0.0,
        0.0, 0.0, 0.0,

        v1,-v2,0.5,
        -v1,-v2,0.5,
        0.0, 0.0, 0.5,

        v1,v2,0.5,
        -v1,v2,0.5,
        0.0, 0.0, 0.5,

        v1,-v2,0.0,
        0.0,0.0,0.0,
        v1,-v2,0.5,

        0.0,0.0,0.0,
        v1,-v2,0.5,
        0.0,0.0,0.5,

        v1,v2,0.0,
        0.0,0.0,0.0,
        v1,v2,0.5,

        0.0,0.0,0.0,
        v1,v2,0.5,
        0.0,0.0,0.5,

        -v1,-v2,0.0,
        0.0,0.0,0.0,
        -v1,-v2,0.5,

        0.0,0.0,0.0,
        -v1,-v2,0.5,
        0.0,0.0,0.5,

        -v1,v2,0.0,
        0.0,0.0,0.0,
        -v1,v2,0.5,

        0.0,0.0,0.0,
        -v1,v2,0.5,
        0.0,0.0,0.5,
    ];
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
    // Now set up the colors for the faces. We'll use solid colors
    // for each face.
  
    const faceColors = [
        [1.0,0.39,0.28,1]
    ];
  
    // Convert the array of colors into a table for all the vertices.
  
    var colors = [];
  
    for (var j = 0; j < 12; ++j) {
      const c = faceColors[0];
  
      // Repeat each color four times for the four vertices of the face
      colors = colors.concat(c, c, c);
      
    }
  
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  
    // Build the element array buffer; this specifies the indices
    // into the vertex arrays for each face's vertices.
  
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  
    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
  
    const indices = [];
    var i;
    for(i=0;i<36;i++)   indices.push(i);
    // Now send the element array to GL
  
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);
  
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
          
            const textureCoordinates = [
              // Front
              0.0,  0.0,
              1.0,  0.0,
              1.0,  1.0,

              1.0,  0.0,
              1.0,  1.0,
              0.0,  1.0,
              // Back
              0.0,  0.0,
              1.0,  0.0,
              1.0,  1.0,

              1.0,  0.0,
              1.0,  1.0,
              0.0,  1.0,
              // Top
              0.0,  0.0,
              1.0,  0.0,
              1.0,  1.0,

              1.0,  0.0,
              1.0,  1.0,
              0.0,  1.0,
              // Bottom
              0.0,  0.0,
              1.0,  0.0,
              1.0,  1.0,

              1.0,  0.0,
              1.0,  1.0,
              0.0,  1.0,
              // Right
              0.0,  0.0,
              1.0,  0.0,
              1.0,  1.0,

              1.0,  0.0,
              1.0,  1.0,
              0.0,  1.0,
              // Left
              0.0,  0.0,
              1.0,  0.0,
              1.0,  1.0,

              1.0,  0.0,
              1.0,  1.0,
              0.0,  1.0,
              
            ];
          
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                          gl.STATIC_DRAW);
          
        return {
              position: positionBuffer,
              textureCoord: textureCoordBuffer,
              indices: indexBuffer,
              color: colorBuffer
            };
  }
  
  function drawObsPos2(gl, programInfo, buffers, deltaTime) {

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
  
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
  
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);
  
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();
  
    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    obsPos += (10*deltaTime);
    mat4.translate(modelViewMatrix,     // destination matrix
                   modelViewMatrix,     // matrix to translate
                   [-0.0, 1.5-height, obsPos]);  // amount to translate
    if(dist>10.0)
    obsRot += speed;
    mat4.rotate(modelViewMatrix,  // destination matrix
                modelViewMatrix,  // matrix to rotate
                obsRot,     // amount to rotate in radians
                [0, 0, 1]);       // axis to rotate around (Z)
    var num,stride,type,normalize,offset;
    
    {
      const numComponents = 3;
      type = gl.FLOAT;
      normalize = false;
      stride = 0;
      offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
    }
  
    // Tell WebGL how to pull out the colors from the color buffer
    // into the vertexColor attribute.
    
    if(flag==0)
    {
      num = 4;
      type = gl.FLOAT;
      normalize = false;
      stride = 0;
      offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexColor,
          num,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexColor);
    }
    else
    {
        num = 2; // every coordinate composed of 2 values
        type = gl.FLOAT; // the data in the buffer is 32 bit float
        normalize = false; // don't normalize
        stride = 0; // how many bytes to get from one set to the next
        offset = 0; // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    }
  
  
    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  
    // Tell WebGL to use our program when drawing
  
    gl.useProgram(programInfo.program);
  
    // Set the shader uniforms
  
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
    
        if(flag==1){
            gl.activeTexture(gl.TEXTURE0);
    
            // Bind the texture to texture unit 0
            gl.bindTexture(gl.TEXTURE_2D, texture2);
          
            // Tell the shader we bound the texture to texture unit 0
            gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
    }  
    {
      const vertexCount = 36;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  
    // Update the rotation for the next draw
  
  }