import { Viewer } from "./Viewer";
import "./styles.css";

const astro =
    "https://res.cloudinary.com/dqsubx7oc/image/upload/v1634314913/3d/Astronaut_xuzmlh.glb";
const chair =
    "https://res.cloudinary.com/dqsubx7oc/image/upload/v1634329778/3d/SheenChair_mvnq8u.glb";

const hdr = "https://res.cloudinary.com/dqsubx7oc/raw/upload/v1634721182/3d/studio_small_08_1k_d7pxua.hdr";

const viewer = new Viewer(document.getElementById("viewer"), {});
viewer.loadModel(chair, hdr).then(() => {
    console.log("loaded");
})
