import React, { useEffect } from "react";

export const Element = () => {

    const getSelectedElement = async () => {
        const element = await webflow.getSelectedElement();
        const folders = await webflow.getAllAssetFolders()

        // Print element info
        if (folders && element?.styles) {
            // console.log(`Selected Element ID: ${element.id}`);
            // console.log(`Element type: ${element.type}`);
            const styles = await element.getStyles()
            const allProperties: { [key: string]: any } = {};
            for (const style of styles) {
                // Use string type for styleName
                const styleName: string = await style.getName();
                const breakpoint : BreakpointAndPseudo = {breakpoint: 'xxl'}
                const properties = await style.getProperties(breakpoint);
                allProperties[styleName] = properties;
              }
              console.log(allProperties);
            console.log("folders", folders)
            console.log("styles", styles)

            // Perform some action with the selected element
        } else {
            console.log("No element is currently selected.");
        }
    }
    const setSelectedElement = async () => {
        const rootElement = await webflow.getRootElement();

        // Print element info
        if (rootElement) {
            const selectedElement = await webflow.setSelectedElement(rootElement);
            if (selectedElement?.children) {
                // Start building elements on the selected element
                await selectedElement?.append(webflow.elementPresets.DOM)
            } else {
                console.log("No element is currently selected.");
            }
        }
    }
    useEffect(() => {
        const getElement = async () => {
            // await getSelectedElement();
            await setSelectedElement();
        }
        getElement().then((data) => {
            console.log("Element selected successfully", data);
        }).catch((error) => {
            console.error("Error fetching assets:", error);
        });
    }, [])
    // Get Selected Element
    return (
        <button onClick={getSelectedElement}>Select</button>
    )

}
