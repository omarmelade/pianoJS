// Checks that your browser supports WebGL. 
if (!Detector.webgl) Detector.addGetWebGLMessage();

var renderer = null;
var scene = null;
var camera = null;
var piano = null;
var cameraAngle = null;
var curTime = Date.now();

// groups
var key_grp = null;
var notes_group = null;
var piano_group = null;

var notes_tab = [];
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

var directionalLight;

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
    var geometry = new THREE.BoxGeometry(5, 1, 2);

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

    ///////////////////////////// GROUPS ---------------------------------------------


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


    /////// NOTES GROUP
    notes_group = new THREE.Group();

    light = new THREE.PointLight( 0xffffff, 1.5);
    light.position.set( 0, 10, 20);
    light.intensity = 0.85;
    scene.add( light );
    
    
    const amL = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( amL );
    
    directionalLight = new THREE.DirectionalLight( 0xf00fff, 1 );
    directionalLight.position.set(0,0,20);
    directionalLight.castShadow = true;
    directionalLight.intensity = 0.3
    scene.add( directionalLight );
    scene.add( directionalLight.target );


    ////////////////////////////// CAMERA CONTROLS ------------------------------------------

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;  
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 20;

    // Finally, add the mesh to our scene
    scene.add(piano_group);
    piano_group.rotation.x = 0.2;
    piano_group.position.y = -3;
    
    piano_group.add(notes_group);
    scene.add(notes_group);

    //////////////////////////////// AUDIO CONTROLS
    ktab = [
        { key: 65, f: 261.63, c: real_k1, man: {}, sTime: 0, pressed: false, color : 0xff0000 }, 
        { key: 90, f: 293.66, c: real_k2, man: {}, sTime: 0, pressed: false, color : 0xff7f00 }, 
        { key: 69, f: 329.63, c: real_k3, man: {}, sTime: 0, pressed: false, color : 0xffff00 }, 
        { key: 82, f: 349.23, c: real_k4, man: {}, sTime: 0, pressed: false, color : 0x00ff00 }, 
        { key: 84, f: 392.0,  c: real_k5, man: {}, sTime: 0, pressed: false, color : 0x0000ff },
        { key: 89, f: 440.0,  c: real_k6, man: {}, sTime: 0, pressed: false, color : 0x4b0082 },
        { key: 85, f: 493.88, c: real_k7, man: {}, sTime: 0, pressed: false, color : 0x7f00ff }
    ];
    
    
    master = ctx.createGain();
    master.gain.value = 0.02;
    master.connect(ctx.destination);

////// SAFARI UNCOMPATIBLE 

    dest = ctx.createMediaStreamDestination();
    mediaRecorder = new MediaRecorder(dest.stream);
    master.connect(dest);

    mediaRecorder.ondataavailable = function(evt) {
        // push each chunk (blobs) in an array
        chunks.push(evt.data);
    };

    mediaRecorder.onstop = function(evt) {
        // Make blob out of our blobs, and open it.
        let blob = new Blob(chunks, { 'type' : 'audio/mp3; codecs=opus' });
        let audioTag = document.createElement('audio');
        document.querySelector("audio").src = URL.createObjectURL(blob);
        document.querySelector("#download").href = URL.createObjectURL(blob);
        console.log(URL.createObjectURL(blob));
    };

////////////////


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
            
            keytab[i]['man'].vco2.frequency.value = transpose(keytab[i]['f'], 7);


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


    

    /////////////////////// ------------------- MANAGE SOUND

    function createNotes(groupe, pos, color){
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        // const color = THREE.MathUtils.randInt(0, 0xffffff)
        const material = new THREE.MeshPhongMaterial({ color: color });
        const note = new THREE.Mesh(geometry, material);

        note.position.set( pos.x - 5.5, pos.y - 2, pos.z - .3 );
        
        notes_tab.push(note);
        groupe.add(note);
    }

    initTabNotes(ktab);

    p1 = 0.8;
    p2 = 0.40;
    
    async function soundNote(man, container, tab) {

        const color = THREE.MathUtils.randInt(0, 0xffffff)
        tab['sTime'] = ctx.currentTime;
        if(tab['sTime'] == 0)
        {
            man['vca'].gain.value = 0.1;
            man['vca2'].gain.value = 0.1;
        }

        man['vca'].gain.exponentialRampToValueAtTime(p1, ctx.currentTime );
        man['vca2'].gain.exponentialRampToValueAtTime(p2, ctx.currentTime );
        
        let key = tab['c'].children[0]['children'][0];
        createNotes(notes_group, key.position,  tab['color']);

        directionalLight.color =  new THREE.Color(tab['color']);
        directionalLight.position.x = key.position.x;
        console.log(key.position);

        container.rotation.x = 0.1;
    }

    async function stopNote(man, container, tab) {
        
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

    ///////////////////////////// ----------------- controls

    document.addEventListener("keydown", setupKeyControls, false);
        function setupKeyControls(e) {
        ctx.resume();
        var k = e.keyCode;
        for (let i = 0; i < ktab.length; i++) {
            if (ktab[i]['key'] == k)
            {
                let man = ktab[i]['man'];
                let c = ktab[i]['c'];
                ktab[i]['pressed'] = true;

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
                ktab[i]['pressed'] = false;
                stopNote(man, c, ktab[i]);
            }
        }
    }

    
///////////////////////////// SAFARI Uncompatible Record 
    let record = document.querySelector("#rec");

    record.addEventListener("click", function(e) {
        if (!clicked) {
            mediaRecorder.start();
            e.target.innerHTML = "Stop recording";
            clicked = true;
            document.querySelector("#download").hidden = true;
        } else {
            chunks = [];
            clicked = false;
            document.querySelector("#download").hidden = false;
            mediaRecorder.requestData();
            mediaRecorder.stop();
            e.target.innerHTML = "Record again";
        }
    });


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

    var angle = 0.1 * Math.PI * 2 * fracTime; // one turn per 10 second.
    var angleR = fracTime * Math.PI * 2;

          

    notes_tab.forEach((n, i) => {
        n.position.y += 0.05;
        if(notes_tab[i].position.y > 50)
        {
            notes_tab[i].visible = false;
        }
    });

    
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