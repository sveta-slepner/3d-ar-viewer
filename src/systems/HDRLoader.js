import {PMREMGenerator, UnsignedByteType} from "three";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {DebugEnvironment} from "three/examples/jsm/environments/DebugEnvironment";

export const loadHdr = (renderer, scene, hdr = 'basic', shouldShowAsBackground = false)  => {
    return new Promise((resolve, reject) => {
        const pmremGenerator = new PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        if (hdr === 'basic') {
            const envScene = new DebugEnvironment();
            const generatedCubeRenderTarget = pmremGenerator.fromScene( envScene );
            const envMap = generatedCubeRenderTarget.texture;
            scene.environment = envMap;
            if (shouldShowAsBackground) {
                scene.background = envMap;
            }
            pmremGenerator.dispose();
            resolve();
        } else {
            new RGBELoader().setDataType(UnsignedByteType).load(
                hdr,
                texture => {
                    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                    scene.environment = envMap;
                    if (shouldShowAsBackground) {
                        scene.background = envMap;
                    }
                    texture.dispose();
                    pmremGenerator.dispose();
                    resolve();
                },
                xhr => {
                    console.log(`HDR ${Math.floor((xhr.loaded / xhr.total) * 100)}% loaded`);
                },
                err => {
                    reject(new Error(err));
                }
            );
        }
    });
}
