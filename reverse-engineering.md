# Knotshot Reverse Engineering Report

This document details the findings from the analysis of the minified Knotshot application bundle. It describes the architecture, core technologies, and key logic of the original application.

## Core Technologies

The application is a **Meteor.js** application, which provides a full-stack framework including both client and server components.

*   **Backend:** Meteor's default backend with **MongoDB** for the database.
*   **Frontend Framework:** The UI is built with **React**.
*   **Canvas Library:** The interactive knot grid is rendered and managed using the **`fabric.js`** library.

## Application Architecture

The application follows a typical Meteor client-server architecture.

*   **Data Management:** Data, such as user patterns, is stored in a MongoDB database and managed through Meteor's `Mongo.Collection`. The client-side code interacts with these collections via publications and method calls. The primary collection identified is `MODEL.patterns`.
*   **Server-side Logic:** The server handles data persistence operations like creating, editing, and deleting patterns (`createPattern`, `editPattern`, `deletePattern`).
*   **Client-side Logic:** The client-side is a single-page application that fetches data from the server and renders the UI. It contains all the logic for the macrame design tool.

## Frontend Analysis

### UI Components

The application's UI is broken down into a set of React components. The component names have been recovered from the beautified source code.

*   **Pages:** `PageLogin`, `PageRegister`, `PageHome`, `PagePublicCanvas`, `PageWorkspace`.
*   **Forms:** `FieldTextInput`, `FieldTextareaInput`, `FieldSelectInput`, `FieldCheckbox`.
*   **Modals:** `BlockTileColorUpdateModal` and others.
*   **Partials:** `PartialLoadingDots`, `PartialColorPicker`.

### Key React Component: `BlockPublicCanvas.jsx`

This is the central component for the macrame pattern editor. It is responsible for initializing the `fabric.js` canvas and managing all user interactions with the design grid.

*   **Source Location:** The logic for this component is found within the main beautified JavaScript file: `extract/programs/web.browser/8f9b6d3e5b52f595a15efa7ce9522e1772897f83.beautified.js`.

## Core Design Logic: Knot Rendering and Manipulation

The most complex part of the application is the logic that handles the macrame knots on the canvas.

### Knot Rendering Pipeline

1.  **`getKnotTile` function:** This utility function (located in `UTILS.workspace`) is the factory for creating a single knot tile.
2.  **`KnotPaths` Constant:** `getKnotTile` looks up SVG path data from this large constant. The constant contains the raw `<path>` data for each segment of each knot type.
3.  **`fabric.Group`:** The function constructs a `fabric.Group` object for each knot. A group is a collection of `fabric.Path` objects, each corresponding to a segment of the knot. This grouping allows the entire knot to be treated as a single object on the canvas.

### Knot Structure and Data

*   **Knot Types:** The application defines several knot types, including `LF` (Left Facing), `RF` (Right Facing), and `TOP`. These are identified internally by numeric constants.
*   **SVG Assets:** The raw visual data for the knots originates from SVG files, which have been extracted to `extract/programs/web.browser/app/images/`. These files (`knot-lf.svg`, `knot-rf.svg`, `knot-top.svg`) reveal the structure of the knots, where each colored segment is a separate `<path>` element with a unique ID (e.g., `a-in`, `c-out`). These IDs are used to target specific segments for color changes.

### Data Model

The entire macrame pattern is stored in a `pattern` object with the following key fields:

*   `palatte`: An array of color strings available for the pattern.
*   `tiles` and `topTiles`: These arrays represent the main grid and the top row of knots, respectively. Each element in these arrays is an object that defines a single knot tile, including:
    *   `knotType`: The type of knot (e.g., `1` for `LF`).
    *   `colors`: An object that maps the SVG path IDs (e.g., `a-in`) to a color ID from the `palatte` array.

The full design is also stored as Fabric.js JSON within the `tiles` and `topTiles` fields in the database, allowing for easy loading and saving of canvas state.

### Color Logic

*   **Color Palette:** A dedicated React component allows users to manage the `pattern.palatte` array.
*   **Color Propagation:** The `tileColorPropagate` and `topTileColorPropogate` objects define a set of rules that dictate how colors flow from one knot to its neighbors when a knot is placed or its color is changed. This is a critical piece of the application's unique logic, ensuring that the string colors behave realistically as they would in a physical macrame piece.

## Data Persistence

*   **`MODEL.patterns`:** A Meteor `Mongo.Collection` that stores the macrame patterns.
*   **Data Access:**
    *   **Client-side:** Uses shared functions like `getPatterns`, `getPatternsOfUser`, and `getPatternById` to retrieve data.
    *   **Server-side:** Uses methods like `createPattern`, `editPattern`, and `deletePattern` for database modifications.

## Extracted Files for Reference

The following files were extracted from the original application bundle and provide direct insight into the application's structure and assets:

- `extract/main.js`: Main application entry point.
- `extract/star.json`: Project metadata, including Meteor, Node.js, and npm versions.
- `extract/programs/server/program.json`: A manifest of all server-side packages.
- `extract/programs/web.browser/program.json`: A manifest of all client-side assets.
- `extract/programs/web.browser/8f9b6d3e5b52f595a15efa7ce9522e1772897f83.beautified.js`: The de-minified (but still obfuscated) main application logic.
- `extract/programs/web.browser/app/images/*.svg`: The original SVG files for the knot types.
