# Re-implementation Plan for Knotshot

## Overall Assessment: Moderately Difficult

This document outlines a plan for re-implementing the core macrame design UI as a simpler, single-user, in-browser application. The project is considered feasible but moderately difficult due to the need to reverse-engineer minified source code.

## Favorable Factors

These are the aspects of the existing bundle that will significantly aid in the re-implementation effort:

*   **Standard Core Technology:** The core design tool is built on **Fabric.js**, a popular and well-documented open-source canvas library. This eliminates the need to re-implement low-level rendering and object manipulation.
*   **Available SVG Assets:** The SVG images for knots and other design elements are directly available in the `programs/web.browser/app/images/` directory and can be reused.
*   **Standard Data Format:** The application saves designs in the standard **Fabric.js JSON format**. This means existing design data can be easily imported and used in the new application.

## Unfavorable Factors

These are the primary challenges that contribute to the difficulty of the project:

*   **Minified JavaScript:** The client-side JavaScript bundle is minified, meaning the original source code, including variable names, comments, and structure, is lost. This makes the code very difficult to read and understand.
*   **Reverse-Engineering of Core Logic:** The unique application logic that governs how knots are placed, connected, and customized is obscured within the minified code. This logic must be manually traced and re-implemented.

## Summary of Current Findings

Based on the analysis of the beautified JavaScript bundle, here's what has been learned:

*   **Core Technologies:** The original application is a Meteor.js application, using React for its UI components and Fabric.js for the core design tool. Data is managed via MongoDB.
*   **Key Components Identified:**
    *   **`BlockAdminViewCanvas` (likely `BlockKnotshot.jsx`):** A React component responsible for rendering a Fabric.js canvas. It takes `canvasOption`, `tileInfo`, and `_id` as props, initializes a `fabric.Canvas`, and loads data using `loadFromJSON` with `tileInfo`.
    *   **Main Design Component (likely `Knotshot.jsx`):** Another React component that renders a Fabric.js canvas (`id="knotshot-stage"`). It manages state related to editing, selected tiles, colors, and zoom, and appears to be the central component for user interaction.
*   **Data Structure (`pattern` object):**
    *   The application uses a `pattern` object to store design data, managed by `MODEL.patterns` (a `Mongo.Collection`).
    *   A `pattern` object has fields like `_id`, `createdBy`, `createdAt`, `patternName`, `previewImage`, `updatedAt`, `rowCount`, `columnCount`, `palatte`, `tiles`, and `topTiles`.
    *   The `tiles` field (an `Object` defaulting to an empty array) is highly likely to contain the Fabric.js JSON data that describes the macrame pattern. The `BlockAdminViewCanvas` component uses `this.props.pattern.objects`, suggesting the Fabric.js JSON is stored as an `objects` property within the `tiles` field, or `tiles` itself is the array of Fabric.js objects.
*   **SVG Assets:** Existing SVG images for knots and other design elements are available in `archaeology/bundle/programs/web.browser/app/images/`.

## Recommended Approach

The following steps outline a recommended path for re-implementing the application:

1.  **Beautify the Source Code:** Use a JavaScript "beautifier" on the main client-side JavaScript file (`programs/web.browser/8f9b6d3e5b52f595a15efa7ce9522e1772897f83.js`) to restore basic code formatting. (Completed)
2.  **Isolate Core Logic:** Focus analysis on the beautified code that corresponds to the React components responsible for the design tool, such as `Knotshot.jsx` and `BlockKnotshot.jsx`. (In progress, initial components identified)
3.  **Analyze Data Structures:** Study the JSON structure of existing saved designs to understand the properties and objects that constitute a macrame pattern. (Initial analysis of `pattern` object structure completed)
4.  **Set up New React Project:**
    *   Scaffold a new, simple React project (e.g., using `create-react-app`).
    *   Integrate Fabric.js into this new React environment.
    *   Use Jules for asynchronous tasks within the React application.
5.  **Incremental Re-implementation (within React project):**
    *   Use the existing SVG assets to create the basic design elements within Fabric.js.
    *   Gradually re-implement the user interaction logic by translating the logic from the beautified (but still obfuscated) source code.
    *   Build a new, minimal user interface (buttons, color palettes, etc.) around the Fabric.js canvas.

## Conclusion

Re-implementing the core design tool is a viable project, largely thanks to the use of standard technologies and the availability of key assets. However, the primary effort will be a time-consuming reverse-engineering task to extract the application's essential logic from the minified code base. This will require an experienced JavaScript developer.