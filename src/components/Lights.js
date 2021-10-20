import {AmbientLight, DirectionalLight, HemisphereLight} from 'three';


export class Lights {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        this.lights = new Map();
        this._createDefaultLights();
    }

     _createDefaultLights() {
        const hemiLight = new HemisphereLight(0xffeeb1, 0x080820, 1);
        hemiLight.name = 'hemisphere';
        this.lights.set(hemiLight.name, hemiLight);

        const ambientLight = new AmbientLight(0xffffff, 1);
        ambientLight.name = 'ambient';
        this.lights.set(ambientLight.name, hemiLight);

        const directionalLight = new DirectionalLight(0xffffff, 3);
        directionalLight.name = 'directional';
        directionalLight.castShadow = true;
        directionalLight.position.set(0.5, 0, 0.866);
        this.lights.set(directionalLight.name, directionalLight);
    }

    addLightsToCamera() {
        this.scene.add(this.lights.get('hemisphere'));
        this.camera.add(this.lights.get('ambient'));
        this.camera.add(this.lights.get('directional'));
    }

    getLights() {
        return this.lights;
    }
}
