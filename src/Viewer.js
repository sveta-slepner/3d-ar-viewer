import {
    PerspectiveCamera,
    Box3,
    Vector3,
    Scene,
    WebGLRenderer,
    PMREMGenerator,
    sRGBEncoding,
    AmbientLight,
    DirectionalLight,
    HemisphereLight,
    ACESFilmicToneMapping,
} from 'three';

import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {fitCameraToCenteredObject} from "./helpers";

export class Viewer {
    constructor(domElement) {
        this.domElement = domElement;
        const {clientHeight, clientWidth} = this.domElement.parentElement;

        this.content = null;
        this.scene = new Scene();

        // These are just default, we're going to override these values after loading the model itself
        this.camera = new PerspectiveCamera(
            60,
            clientWidth / clientHeight,
            0.01,
            1000
        );

        this.camera.castShadow = true;

        this.scene.add(this.camera);

        this.renderer = new WebGLRenderer({antialias: true, alpha: true});
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = sRGBEncoding;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(clientWidth, clientHeight);

        this.pmremGenerator = new PMREMGenerator(this.renderer);
        this.pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
        this.pmremGenerator.compileEquirectangularShader();

        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        this.domElement.appendChild(this.renderer.domElement);

        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize, false);
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    animate() {
        requestAnimationFrame(this.animate);

        this.controls.update();
        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    setContent(scene, clips) {
        const box = new Box3().setFromObject(scene);
        const size = box.getSize(new Vector3()).length();
        const center = box.getCenter(new Vector3());

        scene.position.x += scene.position.x - center.x;
        scene.position.y += scene.position.y - center.y;
        scene.position.z += scene.position.z - center.z;

        this.camera.updateProjectionMatrix();

        // set camera position
        this.camera.position.copy(center);
        this.camera.position.z += size;
        this.camera.lookAt(center);

        // prevent zoom out!
        this.controls.maxDistance = size / (2 * Math.tan((this.camera.fov * Math.PI) / 360));

        // max zoom of * 2
        this.controls.minDistance = this.controls.maxDistance / 2;

        this.controls.saveState();

        // set lighting
        this.initLights();

        // add scene
        this.scene.add(scene);

        //resize and render
        this.resize();
    }

    initLights() {
        const hemiLight = new HemisphereLight(0xffeeb1, 0x080820, 1);
        this.scene.add(hemiLight);

        const ambientLight = new AmbientLight(0xffffff, 1);
        this.camera.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 3);
        directionalLight.castShadow = true;
        directionalLight.position.set(0.5, 0, 0.866);
        this.camera.add(directionalLight);
    }

    resize() {
        const {clientHeight, clientWidth} = this.domElement.parentElement;
        this.camera.aspect = clientWidth / clientHeight;
        //fitCameraToCenteredObject(this.camera, this.content, 1.3, this.controls);
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(clientWidth, clientHeight);
    }

    traverseMaterials(scene) {
        scene.traverse(n => {
            if (n.isMesh) {
                console.log(n);
                n.castShadow = true;
                n.receiveShadow = true;
                if (n.material.map) n.material.map.anisotropy = 16;
            }
        });
    }

    loadModel(url) {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader().setCrossOrigin("anonymous");
            loader.load(
                url,
                (gltf) => {
                    const scene = gltf.scene || gltf.scenes[0];
                    const clips = gltf.animations || [];

                    if (!scene) {
                        throw new Error("Could not detect a scene in the model.");
                    }

                    this.content = scene;
                    this.setContent(scene, clips);
                    resolve(gltf);
                },
                undefined,
                reject
            );
        });
    }
}
