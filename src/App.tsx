import React, { useEffect, useState } from "react";

export const App = () => {
    const [assets, setAssets] = useState([]); // Store all assets
    const [filteredAssets, setFilteredAssets] = useState([]); // Store filtered assets
    const [filter, setFilter] = useState('all'); // Store selected filter
    const [sortBy, setSortBy] = useState('');

    const showAsset = async () => {
        const assets = await webflow.getAllAssets()
        if (assets && assets.length > 0) {

            // filter image

            const resolvedAssets = await Promise.all(
                assets.map(async (asset) => ({
                    url: await asset.getUrl(),
                    mimeType: await asset.getMimeType(),
                    name: await asset.getName(),
                    altText: await asset.getAltText(),
                }))
            );
            setAssets(resolvedAssets);
            setFilteredAssets(resolvedAssets); // Default to all assets

        }
    }

    useEffect(() => {
        const fetchAssets = async () => {
            const newSize = { width: 500, height: 100 }; // You can change this to "default," "comfortable," or provide { width, height }
            // const newSize = 'comfortable'; // You can c
            // change this to "default," "comfortable," or provide { width, height }
            // Set the Extension UI size
            await webflow.setExtensionSize(newSize);
            try {
                await showAsset();
            } catch (error) {
                console.error("Error fetching assets:", error);
            }
        };

        fetchAssets().then((data) => {
            console.log("Assets fetched successfully", data);
        }).catch((error) => {
            console.error("Error fetching assets:", error);
        });
    }, []);
    useEffect(() => {
        let updatedAssets = [...assets];
        if (filter !== 'all') {
            updatedAssets = assets.filter((asset) => asset.mimeType === filter);
        }
        // if (filter === 'all') {
        //     setFilteredAssets(assets);
        // } else {
        //     setFilteredAssets(assets.filter((asset) => asset.mimeType === filter));
        // }

        // Sort by selected criteria
        if (sortBy === 'nameAsc') {
            updatedAssets.sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical (A-Z)
        } else if (sortBy === 'nameDesc') {
            updatedAssets.sort((a, b) => b.name.localeCompare(a.name)); // Reverse alphabetical (Z-A)
        }

        setFilteredAssets(updatedAssets);

    }, [filter, sortBy, assets]);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(event.target.value);
    };
    // const copyToClipboard = (url) => {
    //     console.log("here")
    //     navigator.clipboard
    //         .writeText(url)
    //         .then(() => alert('Copied to clipboard!'))
    //         .catch((error) => console.error('Failed to copy:', error));
    // };
    const copyToClipboard = (id: string) => {
        console.log("here: ", `#${id}`)
        const custom_code = document.querySelector(`#${id}`) as HTMLTextAreaElement;
        custom_code.select();
        document.execCommand('copy');
    }

    const setAltText = async (altText: string) => { 
        await asset.setAltText(altText)
    }


    return (
        <div>
            <h1>Welcome to My React App!</h1>
            <p>This is a basic React application.</p>
            {/* <button onClick={addText}> Add text </button> */}
            <select onChange={handleFilterChange} value={filter}>
                <option value="all">All</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/gif">GIF</option>
                <option value="image/svg+xml">SVG</option>
                {/* Add more MIME types as needed */}
            </select>
            <select onChange={handleSortChange} value={sortBy}>
                <option value="">Sort By</option>
                <option value="nameAsc">Name (A-Z)</option>
                <option value="nameDesc">Name (Z-A)</option>
            </select>
            <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                {filteredAssets.map((asset, index) => (

                    <div key={index} style={{ margin: '10px' }}>
                        <img
                            src={asset.url}
                            alt={asset.name}
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <p>{asset.name}</p>
                        <textarea id={`textarea-${index}`} placeholder="here is embed code" readOnly>{asset.url}</textarea>
                        <button onClick={() => copyToClipboard(`textarea-${index}`)}>Copy URL</button>
                        <p>Alt Text</p>
                        <textarea>{asset.altText}</textarea>
                        <button onClick={() => setAltText(asset.altText)}>Set Alt Text</button>
                    </div>

                ))}
            </div>

            {/* {img?.map((url, index) => (
                <img key={index} src={url} alt={`Asset ${index}`} style={{ width: '100px', margin: '10px' }} />
            ))} */}
        </div>
    );
};
