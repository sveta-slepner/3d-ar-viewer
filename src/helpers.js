import {Box3, Vector3} from "three";

// https://wejn.org/2020/12/cracking-the-threejs-object-fitting-nut/
export const fitCameraToCenteredObject = (camera, scene, offset, controls) => {
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3()).length();
    const center = box.getCenter(new Vector3());


    camera.updateProjectionMatrix();

    // set camera position
    camera.position.copy(center);
    camera.position.z += size;
    camera.lookAt(center);

    // prevent zoom out!
    controls.maxDistance = size / (2 * Math.tan((camera.fov * Math.PI) / 360));

    // max zoom of * 2
    controls.minDistance = controls.maxDistance / 2;
};
