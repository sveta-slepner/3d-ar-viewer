import {ACESFilmicToneMapping, sRGBEncoding, WebGLRenderer, PCFSoftShadowMap} from 'three';

export const createRenderer = (domElement) => {
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });

    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = sRGBEncoding;
    renderer.gammaFactor = 2.2;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);

    // append the canvas to the root element
    domElement.appendChild(renderer.domElement);

    return renderer;
}
