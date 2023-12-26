// main.js

import { selectPackages } from "./packageSelector.js";

selectPackages()
    .then((selectedPackages) => {
        console.log("Selected packages:", selectedPackages);
        // Further processing with the selected packages and their commands
    })
    .catch((error) => {
        console.error("Error selecting packages:", error);
    });
