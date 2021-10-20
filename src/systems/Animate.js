import { Clock } from 'three';

const clock = new Clock();

class Animate {
    constructor(camera, scene, renderer, controls) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.controls = controls;

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    animate() {
        requestAnimationFrame(this.animate);

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

export { Animate };
