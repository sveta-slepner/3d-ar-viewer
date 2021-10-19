import { Viewer } from "./Viewer";
import "./styles.css";

const astro =
    "https://res.cloudinary.com/dqsubx7oc/image/upload/v1634314913/3d/Astronaut_xuzmlh.glb";
const chair =
    "https://res.cloudinary.com/dqsubx7oc/image/upload/v1634329778/3d/SheenChair_mvnq8u.glb";

const viewer = new Viewer(document.getElementById("viewer"), {});
viewer.loadModel(chair).then(() => {
    console.log("loaded");
})
