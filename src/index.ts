// Import a module that was installed with npm
import p5 from "p5";
// Import a variable from a JavaScript file from the project folder
import { mainSketch } from "./screens/main";
// Import CSS styles in JavaScript
import "./index.css";

// Initialize p5.js
// p5 requires two arguments: new p5(sketch function, target DOM element)
new p5(mainSketch, document.getElementById("sketch") ?? document.body);
