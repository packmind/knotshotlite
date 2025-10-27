# Knotshot Re-implementation Plan

This document summarizes the findings from the reverse engineering of the Knotshot macrame web application. It is intended to be a guide for the re-implementation of the application.

## Core Technologies

*   **Frontend Framework:** The application is built with **React**, as evidenced by the use of JSX syntax and React components (e.g., `React.createElement`, `Component`).
*   **Canvas Library:** The interactive knot grid is rendered using the **`fabric.js`** library. This is clear from the numerous calls to `new fabric.Canvas`, `fabric.Path`, `fabric.Group`, etc.

## UI Components

The application is composed of several UI components, including:

*   **Pages:** `PageLogin`, `PageRegister`, `PageHome`, `PagePublicCanvas`, `PageWorkspace`, etc.
*   **Forms:** `FieldTextInput`, `FieldTextareaInput`, `FieldSelectInput`, `FieldCheckbox`.
*   **Modals:** `BlockTileColorUpdateModal`, and other modals for user interaction.
*   **Partials:** `PartialLoadingDots`, `PartialColorPicker`.

## Key Components and Logic

### `BlockPublicCanvas.jsx`

This is the main React component responsible for rendering and managing the macrame pattern canvas.

*   **Source:** The logic for this component is found within the beautified JavaScript file: `archaeology/bundle/programs/web.browser/8f9b6d3e5b52f595a15efa7ce9522e1772897f83.beautified.js`.

### Knot Rendering

The core of the application is the rendering of individual knots on the canvas.

*   **`getKnotTile` function:** This function, located in the `UTILS.workspace` object, is responsible for creating a single knot tile. It constructs a `fabric.Group` object for each knot.
    *   **Source Reference:** The definition of this function can be found starting around line `245955` in `archaeology/bundle/programs/web.browser/8f9b6d3e5b52f595a15efa7ce9522e1772897f83.beautified.js`.
*   **`KnotPaths` Constant:** This constant holds the raw SVG path data for each type of knot. The `getKnotTile` function retrieves the appropriate path data from this constant based on the `knotType`.
    *   **Source Reference:** The `KnotPaths` constant is defined within the `client/components/canvas/knots.js` module, which is bundled in the beautified JavaScript file. The definition can be found by searching for `KnotPaths:()=>i` in the beautified file.

### Knot Structure and Data

*   **Knot Types:** The application defines several knot types, including `LF` (Left Facing), `RF` (Right Facing), and `TOP`. These are identified by numeric constants.
*   **SVG Path Data:** The visual representation of each knot is composed of several SVG `<path>` elements. Each path has a unique ID (e.g., `a-in`, `c-out`), which is used to control its color. The original SVG files (`knot-lf.svg`, `knot-rf.svg`, `knot-top.svg`) confirm this structure.
*   **Data Model:** The entire macrame pattern is stored in a `pattern` object. This object contains `tiles` and `topTiles` arrays, which represent the grid. Each element in these arrays is an object containing:
    *   `knotType`: The type of knot (e.g., `1` for `LF`).
    *   `colors`: An object mapping path IDs to color IDs from a palette.

### Color Logic

*   **Palette:** The application uses a `palatte` array to store the available colors.
*   **Color Propagation:** The `tileColorPropagate` and `topTileColorPropogate` objects define the rules for how colors should flow from one knot to its neighbors. This is a critical piece of the application's logic.
    *   **Source Reference:** These objects are defined in the `knots.js` module.

## Extracted Files

The following files have been extracted from the `archaeology/` directory into the `extract/` directory for easy reference:

- `extract/main.js`: The main entry point of the application.
- `extract/star.json`: Contains metadata about the project, including the Meteor version (`METEOR@2.6.1`), Node.js version (`14.18.3`), and npm version (`6.14.15`).
- `extract/programs/server/program.json`: Contains a list of all the server-side packages used by the application.
- `extract/programs/web.browser/program.json`: Contains a manifest of all the client-side assets, including JavaScript, CSS, fonts, and images.
- `extract/programs/web.browser/8f9b6d3e5b52f595a15efa7ce9522e1772897f83.beautified.js`: The beautified main application logic.
- `extract/programs/web.browser/app/images/knot-lf.svg`: The SVG file for the left-facing knot.
- `extract/programs/web.browser/app/images/knot-rf.svg`: The SVG file for the right-facing knot.
- `extract/programs/web.browser/app/images/knot-top.svg`: The SVG file for the top knot.

### Server-side Packages

The `extract/programs/server/program.json` file lists all the server-side packages used by the application. This file can be referred to for a complete list of dependencies.

## Next Steps

Based on these findings, the implementation plan is as follows:

1.  **Scaffold a new React application.**
2.  **Install `fabric.js`** as a dependency.
3.  **Create a main canvas component** (similar to `BlockPublicCanvas.jsx`).
4.  **Re-create the `KnotPaths` constant** by extracting the path data from the beautified JavaScript or the original SVG files.
5.  **Implement the `getKnotTile` function** to render knots on the canvas using the `KnotPaths` data.
6.  **Implement the color palette and the color propagation logic** based on the `tileColorPropagate` and `topTileColorPropogate` rules.
