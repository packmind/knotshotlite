# Knotshot Lite Re-implementation Plan

This document outlines the plan for re-implementing Knotshot as "Knotshot Lite", a simple, single-user application designed for open-source distribution to hobbyists.

## Guiding Principles

*   **Simplicity:** The application should be a lightweight Single Page Application (SPA) that runs entirely in the browser.
*   **Open Source:** The goal is to create a project that can be published on GitHub for the community.
*   **No Backend:** All logic will be client-side. We will not use a database or have a dedicated server component.
*   **Flexibility:** We are not required to replicate the original application's components or structure. We will build a new, clean implementation based on the core logic reverse-engineered from the original.

## Architecture & Technology

*   **Framework:** A new **React** project.
*   **Core Graphics:** **`fabric.js`** for canvas manipulation.
*   **Data Storage:** The browser's **Local Storage** will be used to automatically save the user's work.
*   **Data Portability:** We will implement **import and export functionality** for project files, allowing users to save and share their work as files.

## Development Steps

1.  **Project Setup:**
    *   Scaffold a new React application (e.g., using `create-react-app` or Vite).
    *   Install and configure `fabric.js`.

2.  **Core Feature Implementation:**
    *   **Knot Logic:**
        *   Extract SVG path data from the original assets (`extract/programs/web.browser/app/images/`).
        *   Create a module to define the `Knot` types and their path data.
        *   Implement a function to render knots onto the Fabric.js canvas.
    *   **Canvas UI:**
        *   Create the main canvas component.
        *   Develop a simple UI for selecting knot types and placing them on the grid.
    *   **Color System:**
        *   Implement a color palette component.
        *   Re-create the color propagation logic to automatically color connecting knot segments.
    *   **Persistence:**
        *   Implement functions to save the canvas state to Local Storage.
        *   Implement "Save to file" (export) and "Open from file" (import) features.

## Next Step

Begin by scaffolding the new React application in a dedicated `app` directory.
