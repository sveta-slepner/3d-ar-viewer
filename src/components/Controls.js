import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Box3, Vector3} from "three";

export class Controls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        this.controls = new OrbitControls(
            camera,
            domElement
        );
    }

    getControls() {
        return this.controls;
    }

    setControlsDistance(object) {

        const box = new Box3().setFromObject(object);
        const size = box.getSize(new Vector3()).length();

        // prevent zoom out!
        this.controls.maxDistance = size / (2 * Math.tan((this.camera.fov * Math.PI) / 360));

        // max zoom of * 2
        this.controls.minDistance = this.controls.maxDistance / 1.5;

        this.controls.saveState();
    }

}
