import throttle from "../misc/throttle";

const setSize = (container, camera, renderer) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
};

export class Resizer {
    constructor(container, camera, renderer) {
        // set initial size
        setSize(container, camera, renderer);

        const onResize = () => {
            // set the size again if a resize occurs
            setSize(container, camera, renderer);
            // perform any custom actions
            this.onResize();
        };
        const throttled = throttle(onResize, 16);

        window.addEventListener('resize', throttled);
    }

    onResize() {}
}
