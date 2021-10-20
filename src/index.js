import { Viewer } from "./Viewer";
import "./styles.css";

const astro =
    "https://res.cloudinary.com/dqsubx7oc/image/upload/v1634314913/3d/Astronaut_xuzmlh.glb";
const chair =
    "https://res.cloudinary.com/dqsubx7oc/image/upload/v1634329778/3d/SheenChair_mvnq8u.glb";

const table = "https://res.cloudinary.com/dqsubx7oc/image/upload/v1634725287/3d/table/wooden_table_02_2k_ff8c0c.glb";
const chair2 = "https://res.cloudinary.com/dqsubx7oc/image/upload/v1634733189/3d/table/wooden_stool_01_2k_lpvrmo.glb";
const helmet = "https://res.cloudinary.com/dqsubx7oc/image/upload/v1634734601/3d/DamagedHelmet_swqmiu.glb";

const HDR = {
    studio: "https://res.cloudinary.com/dqsubx7oc/raw/upload/v1634721182/3d/studio_small_08_1k_d7pxua.hdr",
    field: "https://res.cloudinary.com/dqsubx7oc/raw/upload/v1634724785/3d/autumn_park_1k_fqjogt.hdr"
}

const chairTexture1 = "https://res.cloudinary.com/dqsubx7oc/image/upload/v1634731169/3d/table/textures/wooden_table_02_diff_2k_blue_mfakfu.jpg";
const chairTexture2 = "https://res.cloudinary.com/dqsubx7oc/image/upload/v1634729415/3d/table/textures/bark_brown_02_diff_2k.jpg";


const viewer = new Viewer(document.getElementById("viewer"), {});

document.getElementById("helmet").addEventListener("click", () =>{
    viewer.loadModel(helmet);
});

document.getElementById("astro").addEventListener("click", () =>{
    viewer.loadModel(astro);
});

document.getElementById("chair").addEventListener("click", () =>{
    viewer.loadModel(chair);
});

let isBG = true;
document.getElementById("hdr").addEventListener("change", (e) =>{
    const value = e.target.value;
    if (value === 'none') {
        viewer.clearHdr();
    } else {
        viewer.loadHdr(value === 'basic' ? undefined : HDR[value], isBG)
    }
});

document.getElementById("hdrbg").addEventListener("change", (e) =>{
    const value = e.target.value;
    isBG = value === 'yes';
});


viewer.loadModel(chair);
