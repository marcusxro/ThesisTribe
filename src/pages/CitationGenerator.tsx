import React from 'react'

const CitationGenerator:React.FC = () => {

    async function getCitationFromURL(url: string): Promise<string | null> {
        const apiUrl = `https://api.zotero.org/groups/YOUR_GROUP_ID/items?url=${encodeURIComponent(url)}&format=json`;
        
        try {
            const response = await fetch(apiUrl, {
                headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
            });
            const data = await response.json();
            
            if (data && data.length > 0) {
                const item = data[0];
                return item.citation || null; // Assuming citation is available directly
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching citation:', error);
            return null;
        }
    }
    
    // Example usage
    (async () => {
        const url = 'https://www.freecodecamp.org/news/the-biggest-changes-in-javascript-this-year/';
        const citation = await getCitationFromURL(url);
        console.log('Citation:', citation);
    })();

  return (
    <div>
        sds
    </div>
  )
}

export default CitationGenerator
