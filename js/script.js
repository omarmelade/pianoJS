// Checks that your browser supports WebGL. 
if (!Detector.webgl) Detector.addGetWebGLMessage();

var renderer = null;
var scene = null;
var camera = null;
var piano = null;
var piano_group = null;
var earth = null;
var moon = null;
var solar_sys = null;
var moon_group = null;
var mars = null;
var cameraAngle = null;
var curTime = Date.now();
var key_grp = null;

var sphere = null;

// Sound things 

var ktab = null;
var master = null;
var p1 = null;
var p2 = null;

// Sound recording 
let dest;
let mediaRecorder;
let clicked = false;
let chunks = [];

// Sounds visualisation
var analyser = null;
var canvas2;
var contexteCanvas;
var tailleMemoireTampon;
var tableauDonnees = new Uint8Array(tailleMemoireTampon);;

// sound ints array
var dataArray = [];
var bufferLength

// Audio context 
var ctx = new (window.AudioContext || window.webkitAudioContext)();

// This function is called whenever the document is loaded
function init() {


    // Get display canvas
    var canvas = document.getElementById("webglcanvas");
    console.log(canvas);

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    // Create a new Three.js scene
    scene = new THREE.Scene();
    // scene.background = new THREE.TextureLoader().load( 'images/MilkyWay/posy.jpg' );
    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height,
        1, 4000);

    camera.position.z = 20;


    //  Create the sun map & geometry
    var piano = new THREE.MeshPhongMaterial({ color: 0xffffff });
    var key2color = new THREE.MeshPhongMaterial({ color: 0xf1ff });
    var geometry = new THREE.CubeGeometry(5, 1, 2);

    key1 = new THREE.Mesh(geometry, piano);
    key1.position.set(0, 0, 0);
    key1.rotation.y = Math.PI / 2;

    key2 = new THREE.Mesh(geometry, piano);
    key2.position.set(2.1, 0, 0);
    key2.rotation.y = Math.PI / 2;

    key3 = new THREE.Mesh(geometry, piano);
    key3.position.set(4.2, 0, 0);
    key3.rotation.y = Math.PI / 2;

    key4 = new THREE.Mesh(geometry, piano);
    key4.position.set(6.3, 0, 0);
    key4.rotation.y = Math.PI / 2;

    key5 = new THREE.Mesh(geometry, piano);
    key5.position.set(8.4, 0, 0);
    key5.rotation.y = Math.PI / 2;

    key6 = new THREE.Mesh(geometry, piano);
    key6.position.set(10.5, 0, 0);
    key6.rotation.y = Math.PI / 2;

    key7 = new THREE.Mesh(geometry, piano);
    key7.position.set(12.6, 0, 0);
    key7.rotation.y = Math.PI / 2;

    /// GROUPS ---------------------------------------------


    /// K1 -----
    key_group1 = new THREE.Group();
    key_group1.add(key1);
    key_group1.position.set(-2.5, 0.5, 2.5);

    real_k1 = new THREE.Group();
    real_k1.add(key_group1)
    real_k1.position.set(0, 0, 0);


    /// K2 ----------
    key_group2 = new THREE.Group();
    key_group2.add(key2);
    key_group2.position.set(-2.5, 0.5, 2.5);

    real_k2 = new THREE.Group();
    real_k2.add(key_group2)
    real_k2.position.set(0, 0, 0);


    /// K3 -------------
    key_group3 = new THREE.Group();
    key_group3.add(key3);
    key_group3.position.set(-2.5, 0.5, 2.5);

    real_k3 = new THREE.Group();
    real_k3.add(key_group3)
    real_k3.position.set(0, 0, 0);


    /// K4 ---------------
    key_group4 = new THREE.Group();
    key_group4.add(key4);
    key_group4.position.set(-2.5, 0.5, 2.5);

    real_k4 = new THREE.Group();
    real_k4.add(key_group4)
    real_k4.position.set(0, 0, 0);


    /// K5 -----------------
    key_group5 = new THREE.Group();
    key_group5.add(key5);
    key_group5.position.set(-2.5, 0.5, 2.5);

    real_k5 = new THREE.Group();
    real_k5.add(key_group5)
    real_k5.position.set(0, 0, 0);


    /// K6 -----------------
    key_group6 = new THREE.Group();
    key_group6.add(key6);
    key_group6.position.set(-2.5, 0.5, 2.5);

    real_k6 = new THREE.Group();
    real_k6.add(key_group6)
    real_k6.position.set(0, 0, 0);


    /// K7 -----------------
    key_group7 = new THREE.Group();
    key_group7.add(key7);
    key_group7.position.set(-2.5, 0.5, 2.5);

    real_k7 = new THREE.Group();
    real_k7.add(key_group7)
    real_k7.position.set(0, 0, 0);


    piano_group = new THREE.Group();
    piano_group.add(real_k1);
    piano_group.add(real_k2);
    piano_group.add(real_k3);
    piano_group.add(real_k4);
    piano_group.add(real_k5);
    piano_group.add(real_k6);
    piano_group.add(real_k7);

    piano_group.position.set(-3,0,0);


    light = new THREE.PointLight( 0xffffff, 1.5);
    light.position.set( -2, 10, 20);
    scene.add( light );
    
    const amL = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( amL );


    // const sg = new THREE.BoxGeometry( 4, 4, 4);
    // const sm = new THREE.MeshNormalMaterial();
    // sphere = new THREE.Mesh( sg, sm );
    // scene.add( sphere );
    // sphere.position.set(0, 4, -4)

    /// CAMERA CONTROLS ------------------------------------------

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 20;

    // Finally, add the mesh to our scene
    scene.add(piano_group);
    piano_group.rotation.x = 0.5;


    ///// AUDIO CONTROLS
    ktab = [
        { key: 65, f: 261.63, c: real_k1, man: {}, sTime: 0 }, 
        { key: 90, f: 293.66, c: real_k2, man: {}, sTime: 0 }, 
        { key: 69, f: 329.63, c: real_k3, man: {}, sTime: 0 }, 
        { key: 82, f: 349.23, c: real_k4, man: {}, sTime: 0 }, 
        { key: 84, f: 392.0,  c: real_k5, man: {}, sTime: 0 },
        { key: 89, f: 440.0,  c: real_k6, man: {}, sTime: 0 },
        { key: 85, f: 493.88, c: real_k7, man: {}, sTime: 0 }
    ];
    

    // const sleep = ms => new Promise(r => setTimeout(r, ms));
    
    master = ctx.createGain();
    master.gain.value = 0.02;
    master.connect(ctx.destination);

    // dest = ctx.createMediaStreamDestination();
    // mediaRecorder = new MediaRecorder(dest.stream);
    // master.connect(dest);

    // mediaRecorder.ondataavailable = function(evt) {
    //     // push each chunk (blobs) in an array
    //     chunks.push(evt.data);
    // };

    // mediaRecorder.onstop = function(evt) {
    //     // Make blob out of our blobs, and open it.
    //     let blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
    //     let audioTag = document.createElement('audio');
    //     document.querySelector("audio").src = URL.createObjectURL(blob);
    // };

    // analyser = ctx.createAnalyser();
    // analyser.connect(dest);

    // analyser.fftSize = 2048;
    // tailleMemoireTampon = analyser.frequencyBinCount;
    // analyser.getByteTimeDomainData(tableauDonnees);
    // canvas2 = document.getElementById("oscilloscope");
    // contexteCanvas = canvas2.getContext("2d");

    // transpose note for better effect 
    function transpose(freq, steps)
    {
        return freq * Math.pow(2, steps / 12);
    }

    let wave1 = document.querySelector('#vco1').selectedOptions[0].value;
    let wave2 = document.querySelector('#vco2').selectedOptions[0].value;

    function initTabNotes(keytab)
    {
        for (let i = 0; i < keytab.length; i++) {
            const manager = {
                vco: ctx.createOscillator(),
                vca: ctx.createGain(),
                vco2: ctx.createOscillator(),
                vca2: ctx.createGain()
            }
  
            keytab[i]['man'] = manager;

            
            keytab[i]['man'].vco.type = wave1;
            keytab[i]['man'].vco2.type = wave2;
            
            keytab[i]['man'].vco.frequency.value = keytab[i]['f'];
            const startingPitch = keytab[i]['man'].vco.frequency.value;
            keytab[i]['man'].vco2.frequency.value = transpose(startingPitch, 7);


            keytab[i]['man'].vco.connect(manager.vca);
            keytab[i]['man'].vco2.connect(manager.vca2);
            
            keytab[i]['man'].vca.connect(master);
            keytab[i]['man'].vca2.connect(master);

            keytab[i]['man'].vca.gain.value = 0.00001;
            keytab[i]['man'].vca2.gain.value = 0.00001;
            
            keytab[i]['man'].vco.start();
            keytab[i]['man'].vco2.start();
            
        }
    }

    // ---------------------------------- MANAGE SOUND
    initTabNotes(ktab);

    p1 = 0.8;
    p2 = 0.40;
    
    async function soundNote(man, container, tab) {

        tab['sTime'] = ctx.currentTime;
        if(tab['sTime'] == 0)
        {
            man['vca'].gain.value = 0.1;
            man['vca2'].gain.value = 0.1;
            // console.log("lol");
        }

        man['vca'].gain.exponentialRampToValueAtTime(p1, ctx.currentTime );
        man['vca2'].gain.exponentialRampToValueAtTime(p2, ctx.currentTime );

        container.rotation.x = 0.1;
    }

    async function stopNote(man, container, tab) {

        // console.log(ctx.currentTime, tab['sTime'], ctx.currentTime - tab['sTime']);
        
        if(ctx.currentTime - tab['sTime'] < 0.2)
        {
            man['vca'].gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
            man['vca2'].gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
            tab['sTime'] = 0;
        }else{
            man['vca'].gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
            man['vca2'].gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
        }
        container.rotation.x = 0;
        
    }


    
    // ----------------- controls
    document.addEventListener("keydown", setupKeyControls, false);
        function setupKeyControls(e) {
        ctx.resume();
        var k = e.keyCode;
        for (let i = 0; i < ktab.length; i++) {
            if (ktab[i]['key'] == k)
            {
                let man = ktab[i]['man'];
                let c = ktab[i]['c'];
                soundNote(man, c, ktab[i]);
            }
        }
    }

    document.addEventListener("keyup", releaseNotes, false);
    function releaseNotes(e) {
        var k = e.keyCode;
        for (let i = 0; i < ktab.length; i++) {
            if (ktab[i]['key'] == k)
            {
                let man = ktab[i]['man'];
                let c = ktab[i]['c'];
                stopNote(man, c, ktab[i]);
            }
        }
    }

    
    // Record 
    // document.querySelector("#rec").addEventListener("click", function(e) {
    //     if (!clicked) {
    //         mediaRecorder.start();
    //         e.target.innerHTML = "Stop recording";
    //         clicked = true;
    //     } else {
    //         chunks = [];
    //         clicked = false;
    //         mediaRecorder.requestData();
    //         mediaRecorder.stop();
    //         e.target.innerHTML = "Record again";
    //     }
    // });


}

// This function is called regularly to update the canvas webgl.
function run() {
    // Ask to call again run 
    requestAnimationFrame(run);
    // Render the scene
    render();

    // Calls the animate function if objects or camera should move
    animate();
}

// This function is called regularly to take care of the rendering.
function render() {
    // Render the scene
    renderer.render(scene, camera);
}

// This function is called regularly to update objects.
function animate() {

    // Computes how time has changed since last display
    var now = Date.now();
    var deltaTime = now - curTime;
    curTime = now;
    var fracTime = deltaTime / 1000; // in seconds
    // Now we can move objects, camera, etc.
    // Example: rotation cube
    var angle = 0.1 * Math.PI * 2 * fracTime; // one turn per 10 second.
    var angleR = fracTime * Math.PI * 2;
}

function changeVC01()
{
    let newWave = document.querySelector('#vco1').selectedOptions[0].value;

    for (let i = 0; i < ktab.length; i++) {
        ktab[i]['man'].vco.type = newWave;
    }
}

function changeVC02()
{
    let newWave = document.querySelector('#vco2').selectedOptions[0].value;

    for (let i = 0; i < ktab.length; i++) {
        ktab[i]['man'].vco2.type = newWave;
    }
}

// Volume controls

function changeP2Vol()
{
    p2 = document.querySelector("#p2Vol").value;
}

function changePisteVal(id, piste)
{
    piste = document.querySelector("#"+id).value;
    console.log(piste);
}

function changeP1Vol()
{   
    p1 = document.querySelector("#p1Vol").value;
}


function changeMasterVol()
{
    let val = document.querySelector("#masterVol").value / 100;
    master.gain.value = val;
}


// function dessiner() {

//     requestAnimationFrame(dessiner);

//     analyser.getByteTimeDomainData(tableauDonnees);

//     contexteCanvas.fillStyle = 'rgb(200, 200, 200)';
//     contexteCanvas.fillRect(0, 0, window.innerWidth, window.innerHeight);

//     contexteCanvas.lineWidth = 2;
//     contexteCanvas.strokeStyle = 'rgb(0, 0, 0)';

//     contexteCanvas.beginPath();

//     var sliceWidth = window.innerWidth * 1.0 / tailleMemoireTampon;
//     var x = 0;

//     for(var i = 0; i < tailleMemoireTampon; i++) {

//     var v = tableauDonnees[i] / 128.0;
//     var y = v * window.innerHeight/2;

//     if(i === 0) {
//         contexteCanvas.moveTo(x, y);
//     } else {
//         contexteCanvas.lineTo(x, y);
//     }

//     x += sliceWidth;
//     }

//     contexteCanvas.lineTo(canvas2.width, canvas2.height/2);
//     contexteCanvas.stroke();
// };