
const clientId = '8fd087f98da24ad2841d4ed1cd3f9886';
const clientSecret = '6ce6b6b9711b4cf89e1a714fdcf72a3c';
const artistIds = [
  '06HL4z0CvFAxyc27GXpf02',
  '0oOet2f43PA68X5RxKobEy',
  '1dVygo6tRFXC8CSWURQJq2',
  '6VuMaDnrHyPL1p4EHjYLi7',
  '0C8ZW7ezQVs4URX5aX7Kqx',
  '64KEffDW9EtZ1y2vBYgq8T',
  '3eDT9fwXKuHWFvgZaaYC5v',
  '4YRxDV8wJFPHPTeXepOstw',
  '66CXWjxzNUsdJxJ2JdwvnR',
  '3OLGltG8UPIea8sA4w0yg0'
  ];


const getAccessToken = async () => {
    
    const basicAuth = btoa(`${clientId}:${clientSecret}`);

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    console.log(data);
    return data.access_token;
};


async function fetchArtistData(artistId,accesstoken) {
    const artistUrl = `https://api.spotify.com/v1/artists/${artistId}`;
    const headers = {
        'Authorization': `Bearer ${accesstoken}`
    };

    try {
        const response = await fetch(artistUrl, { headers });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching artist data:", error);
        return null;
    }
}
// Render artists on the webpage
const renderArtists = (artists) => {
    const artistList = document.getElementById('artist-list');
    artists.forEach((artist) => {
        const artistCard = document.createElement('div');
        artistCard.classList.add('artist-card');

        const artistName = document.createElement('h2');
        artistName.textContent = artist.name;

        const artistImage = document.createElement('img');
        artistImage.classList.add('artist-image');
        artistImage.src = artist.images[1] ? artist.images[1].url : 'default-image.jpg';
        artistImage.alt = artist.name;

        const listItem = document.createElement("p");
        listItem.textContent = `Popularity: ${artist.popularity},Followers:${artist.followers.total}`;


        artistCard.appendChild(artistImage);
        artistCard.appendChild(artistName);
        artistCard.appendChild(listItem);
        artistList.appendChild(artistCard);
    });
};

const main = async () => {
    try {
        const accessToken = await getAccessToken();
        const artistDataPromises = artistIds.map((artistId) => fetchArtistData(artistId,accessToken));
        const topArtists = await Promise.all(artistDataPromises);
        renderArtists(topArtists);
        console.log(accessToken);
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

main();