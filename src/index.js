import { Viewer } from "./Viewer";
import "./styles.css";

const astro =
    "https://res.cloudinary.com/dqsubx7oc/image/upload/v1634314913/3d/Astronaut_xuzmlh.glb";
const chair =
    "https://res.cloudinary.com/dqsubx7oc/image/upload/v1634329778/3d/SheenChair_mvnq8u.glb";

const table = "https://res.cloudinary.com/dqsubx7oc/image/upload/v1634725287/3d/table/wooden_table_02_2k_ff8c0c.glb";

const hdr = "https://res.cloudinary.com/dqsubx7oc/raw/upload/v1634721182/3d/studio_small_08_1k_d7pxua.hdr";
const hdr2 = "https://res.cloudinary.com/dqsubx7oc/raw/upload/v1634724785/3d/autumn_park_1k_fqjogt.hdr";

const chairTexture1 = "https://res.cloudinary.com/dqsubx7oc/image/upload/v1634725624/3d/table/textures/wooden_table_02_rough_2k_xcuuli.jpg";


const viewer = new Viewer(document.getElementById("viewer"), {});
viewer.loadModel(table, hdr).then(() => {
    console.log("loaded");
    viewer.loadHdr(hdr, false).then(() => {
        console.log("loaded hdr");
    })
    // viewer.loadTexture(chairTexture1);
})
