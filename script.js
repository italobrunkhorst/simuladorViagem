document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('travel-form');
    const summarySection = document.getElementById('summary');
    const summaryContent = document.getElementById('summary-content');
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const destination = document.getElementById('destination').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const budget = document.getElementById('budget').value;
        
        const activitiesSelect = document.getElementById('activities');
        const selectedActivities = Array.from(activitiesSelect.selectedOptions).map(option => option.text);

        const start = new Date(startDate);
        const end = new Date(endDate);
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        summaryContent.innerHTML = `
            <p><strong>Destino:</strong> ${destination}</p>
            <p><strong>Data de Início:</strong> ${startDate}</p>
            <p><strong>Data de Fim:</strong> ${endDate}</p>
            <p><strong>Duração:</strong> ${duration} dias</p>
            <p><strong>Orçamento:</strong> R$ ${parseFloat(budget).toFixed(2)}</p>
            <p><strong>Atividades:</strong> ${selectedActivities.join(', ')}</p>
        `;

        summarySection.hidden = false;

        const coordinates = await getCoordinates(destination);

        if (coordinates) {
            const mapSection = document.getElementById('map');
            mapSection.hidden = false;

            const map = new google.maps.Map(document.getElementById('map-container'),{
                center: { lat: coordinates.lat, lng: coordinates.lng},
                zoom: 12
            });

            new google.maps.Marker({
                position: {lat: coordinates.lat, lng: coordinates.lng},
                map: map,
                title: destination
            });
        }
    });
    function initMap(){

    }
    async function getCoordinates(destination) {
        const apiKey = 'AIzaSyCcAcZy5HSoyy1frqy9EQCZB1PEgF9EAE0';
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=${apiKey}`;

        try{
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === 'OK') {
                const location = data.results[0].geometry.location;
                return location;
            }
            else{
                throw new Error('Localização não encontrada');
            }
        }catch(error){
            console.error(error);
            return null;
        }
    }
});