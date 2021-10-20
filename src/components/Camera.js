import { PerspectiveCamera } from 'three';

function createCamera(scene) {
    const camera = new PerspectiveCamera(60, 1, 0.1, 100);

    camera.position.set(0, 0, 10);
    camera.castShadow = true;

    scene.add(camera);

    return camera;
}

export { createCamera };
