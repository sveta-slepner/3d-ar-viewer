import { Box3, Vector3, Scene } from 'three';

import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {createRenderer} from "./systems/Renderer";
import {Resizer} from "./systems/Resizer";
import {createCamera} from "./components/Camera";
import {Controls} from "./components/Controls";
import {Lights} from "./components/Lights";
import {Animate} from "./systems/Animate";
import {repositionObjectAndCameraToCenter} from "./Viewer.helpers";

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

                    this.setContent(scene, clips);
                    resolve(gltf);
                },
                undefined,
                reject
            );
        });
    }
}
