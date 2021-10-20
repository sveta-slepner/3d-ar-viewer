import {Scene, TextureLoader, sRGBEncoding, LoadingManager, REVISION, Mesh, MeshStandardMaterial} from 'three';

import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

import {createRenderer} from "./systems/Renderer";
import {Resizer} from "./systems/Resizer";
import {createCamera} from "./components/Camera";
import {Controls} from "./components/Controls";
import {Lights} from "./components/Lights";
import {Animate} from "./systems/Animate";
import {repositionObjectAndCameraToCenter} from "./Viewer.helpers";
import { loadHdr } from "./systems/HDRLoader";
import {loadTexture} from "./systems/TextureLoader";

const loadingManager = new LoadingManager();
const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`
const dracoLoader = new DRACOLoader( loadingManager ).setDecoderPath( `${THREE_PATH}/examples/js/libs/draco/gltf/` );
const ktx2Loader = new KTX2Loader( loadingManager ).setTranscoderPath( `${THREE_PATH}/examples/js/libs/basis/` );

export class Viewer {
    constructor(domElement) {
        this.domElement = domElement;

        this.currentObject = null;
        this.scene = new Scene();

        this.camera = createCamera(this.scene);

        this.renderer = createRenderer(domElement);

        this.controls = new Controls(this.camera, this.domElement);

        this.lights = new Lights(this.camera, this.scene);
        this.lights.addLightsToCamera();

        this.resizer = new Resizer(this.domElement, this.camera, this.renderer);

        this.animate = new Animate(this.camera, this.scene, this.renderer, this.controls.getControls());
    }

    setContent(object, clips) {
        repositionObjectAndCameraToCenter(object, this.camera);
        this.controls.setControlsDistance(object);

        //remove previous object, since we currently support one
        this.currentObject && this.scene.remove(this.currentObject);

        // add object to scene
        this.scene.add(object);
        this.currentObject = object;
    }

    loadHdr(hdr, shouldShowAsBackground) {
        return loadHdr(this.renderer, this.scene, hdr, shouldShowAsBackground);
    }

    clearHdr() {
        this.scene.environment = null;
        this.scene.background = null;
    }

    loadTextures(textures) {
        const mapTypes = Object.keys(textures);
        Promise.all(Object.values(textures).map(texture => loadTexture(texture))).then((textureMaps) => {
            for (let i = 0; i < textureMaps.length; i++) {
                const mapType = mapTypes[i];
                const textureMap = textureMaps[i];
                this.currentObject.traverse((o) => {
                    if (o.isMesh) {
                        textureMap.flipY = false;
                        o.material[mapType] = textureMap;
                        o.material.needsUpdate = true;
                    }
                });
            }
        })
    }

    loadModel(url) {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader().setCrossOrigin("anonymous").setDRACOLoader(dracoLoader).setKTX2Loader( ktx2Loader.detectSupport( this.renderer ) ).setMeshoptDecoder( MeshoptDecoder );
            loader.load(
                url,
                (gltf) => {
                    const scene = gltf.scene || gltf.scenes[0];
                    const clips = gltf.animations || [];

                    if (!scene) {
                        throw new Error("Could not detect a scene in the model.");
                    }

                    this.setContent(scene, clips);
                    resolve(gltf);
                },
                undefined,
                reject
            );
        });
    }
}
