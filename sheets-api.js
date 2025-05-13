/**
 * Google Sheets API Integration
 * This file handles fetching and manipulating data from Google Sheets
 */

// Google Sheets API Configuration - Using the user's provided script and spreadsheet
const SHEETS_CONFIG = {
    scriptUrl: "https://script.google.com/macros/s/AKfycbwlG8II0z_k2HwuyU2WdLn_4tnFyL7iMEgf3gpapWQ5xTqPudf-hwhUZAW1RFDdu6Txsg/exec",
    sheetId: "1PNCJ3FRKfbvhSc7yCGMa4nhrfRfqDhsHpRmR4RUfp9Q"
};

/**
 * Fetch data from Google Sheets
 * @param {string} sheetName - Name of the sheet to fetch data from
 * @param {string} functionName - Function to call in the Google Apps Script
 * @param {Object} additionalParams - Additional parameters to pass to the function
 * @returns {Promise} - Promise resolving to the sheet data
 */
function fetchFromSheets(sheetName, functionName, additionalParams = {}) {
    return new Promise((resolve, reject) => {
        try {
            // Build URL with parameters
            const url = new URL(SHEETS_CONFIG.scriptUrl);
            url.searchParams.append('ID', SHEETS_CONFIG.sheetId);
            url.searchParams.append('SH', sheetName);
            url.searchParams.append('FN', functionName);
            
            // Add any additional parameters
            Object.keys(additionalParams).forEach(key => {
                url.searchParams.append(key, additionalParams[key]);
            });
            
            console.log('Fetching from Google Sheets URL:', url.toString());
            
            // Use JSONP approach which works around CORS restrictions
            // Create a unique callback function name
            const callbackName = 'googleSheetsCallback_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            
            // Set timeout to handle cases where the script fails to load
            const timeoutID = setTimeout(() => {
                // Clean up if timeout occurs
                window[callbackName] = null;
                document.body.removeChild(scriptElement);
                reject(new Error('Request to Google Sheets timed out after 20 seconds'));
            }, 20000);
            
            // Create global callback function
            window[callbackName] = function(data) {
                // Clear timeout
                clearTimeout(timeoutID);
                
                // Clean up - remove script and delete callback
                document.body.removeChild(scriptElement);
                window[callbackName] = null;
                
                // Process and resolve data
                console.log('Data received from Google Sheets:', data);
                resolve(data);
            };
            
            // Create script element
            const scriptElement = document.createElement('script');
            scriptElement.src = `${url.toString()}&callback=${callbackName}`;
            
            // Handle load errors
            scriptElement.onerror = function(error) {
                // Clear timeout
                clearTimeout(timeoutID);
                
                // Clean up
                document.body.removeChild(scriptElement);
                window[callbackName] = null;
                
                console.error('Error loading Google Sheets script:', error);
                reject(new Error('Failed to load Google Sheets data. Check your internet connection and try again.'));
            };
            
            // Add script to page to initiate request
            document.body.appendChild(scriptElement);
        } catch (error) {
            console.error('Error in fetchFromSheets:', error);
            reject(error);
        }
    });
}

/**
 * Fetch all apps data from Google Sheets
 * @returns {Promise} - Promise resolving to apps data
 */
function fetchAppsFromSheets() {
    return fetchFromSheets('Apps', 'readSheet')
        .then(data => {
            // Process the data to match the structure we need
            if (!Array.isArray(data) || data.length < 2) {
                throw new Error('Invalid data structure from Google Sheets');
            }

            // First row is headers
            const headers = data[0];
            
            // Process each row (skipping header)
            return data.slice(1).map(row => {
                const app = {};
                
                // Map each column to a property using the header name
                headers.forEach((header, index) => {
                    // Clean up header name to be used as property name
                    const propName = header.trim().toLowerCase().replace(/\s+/g, '_');
                    
                    // Special handling for certain fields
                    if (propName === 'detail_images' || propName === 'features' || propName === 'technologies') {
                        // These should be arrays - parse if string or create empty array
                        try {
                            app[propName] = row[index] ? JSON.parse(row[index]) : [];
                        } catch (e) {
                            // If not valid JSON, split by commas
                            app[propName] = row[index] ? row[index].split(',').map(item => item.trim()) : [];
                        }
                    } else if (propName === 'links') {
                        // Links should be an object
                        try {
                            app[propName] = row[index] ? JSON.parse(row[index]) : {};
                        } catch (e) {
                            app[propName] = {};
                        }
                    } else {
                        // Regular string or number
                        app[propName] = row[index];
                    }
                });
                
                return app;
            });
        });
}

/**
 * Write app data to Google Sheets
 * @param {Object} appData - The app data to write
 * @returns {Promise} - Promise resolving when data is written
 */
function writeAppToSheets(appData) {
    // Format data for Google Sheets based on the user's appendRow function format
    const rowData = [
        appData.id || '',
        appData.title || '',
        appData.description || '',
        appData.imageUrl || '',
        appData.detailsUrl || '',
        appData.detailedDescription || '',
        appData.platform || '',
        JSON.stringify(appData.detailImages || []),
        appData.problem || '',
        appData.solution || '',
        JSON.stringify(appData.features || []),
        JSON.stringify(appData.technologies || []),
        JSON.stringify(appData.links || {})
    ];

    // Create a CSV-like string as required by the user's script
    // We need to properly escape and quote the string values
    const dataString = rowData.map(item => {
        if (item === null || item === undefined) return '';
        
        // Convert to string if not already
        const str = typeof item === 'string' ? item : String(item);
        
        // Check if we need to escape and quote
        if (str.includes(',') || str.includes('\n') || str.includes('"')) {
            // Escape double quotes and wrap in quotes
            return '"' + str.replace(/"/g, '""') + '"';
        }
        
        return str;
    }).join(',');
    
    console.log('Sending data to Google Sheets with the appendRow function');
    
    // Use the appendRow function from the user's script
    return fetchFromSheets('Apps', 'appendRow', { DATA: dataString });
}
