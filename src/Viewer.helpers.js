import {Box3, Vector3} from "three";

export const repositionObjectAndCameraToCenter = (object, camera) => {
    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3()).length();
    const center = box.getCenter(new Vector3());

    object.position.x += object.position.x - center.x;
    object.position.y += object.position.y - center.y;
    object.position.z += object.position.z - center.z;

    camera.updateProjectionMatrix();

    // set camera position
    camera.position.copy(center);
    camera.position.z += size;
    camera.lookAt(center);
};
