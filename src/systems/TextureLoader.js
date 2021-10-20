import {TextureLoader} from "three";

export const loadTexture = (url) => {
    return new Promise((resolve, reject) => {
        const textureLoader = new TextureLoader();
        textureLoader.load(url, (texture) => {
            resolve(texture);
        },() => {}, (e) => {
            reject(e);
        })
    });
}
