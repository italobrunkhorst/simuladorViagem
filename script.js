document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('travel-form');
    const summarySection = document.getElementById('summary');
    const summaryContent = document.getElementById('summary-content');
    const apiKeyWeather = '9502bf0d537be27bcb9eeabf0c81459d';  // API do OpenWeatherMap
    
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

        // Buscar o clima para o destino
        async function fetchWeather(city) {
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyWeather}&units=metric&lang=pt_br`;

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                if (response.ok) {
                    const weatherDescription = data.weather[0].description;
                    const temperature = data.main.temp;
                    return `Clima: ${weatherDescription}, ${temperature}°C`;
                } else {
                    throw new Error('Erro ao buscar dados do clima');
                }
            } catch (error) {
                console.error(error);
                return 'Informações do clima não disponíveis no momento.';
            }
        }

        const weatherInfo = await fetchWeather(destination);

        // Preencher o resumo da viagem
        summaryContent.innerHTML = `
            <p><strong>Destino:</strong> ${destination}</p>
            <p><strong>Data de Início:</strong> ${startDate}</p>
            <p><strong>Data de Fim:</strong> ${endDate}</p>
            <p><strong>Duração:</strong> ${duration} dias</p>
            <p><strong>Orçamento:</strong> R$ ${parseFloat(budget).toFixed(2)}</p>
            <p><strong>Atividades:</strong> ${selectedActivities.join(', ')}</p>
            <p><strong>${weatherInfo}</strong></p>
        `;
        summarySection.hidden = false;

        // Obter coordenadas do destino para exibir o mapa
        const coordinates = await getCoordinates(destination);
        if (coordinates) {
            const mapSection = document.getElementById('map');
            mapSection.hidden = false;

            // Inicializar o mapa
            const map = new google.maps.Map(document.getElementById('map-container'), {
                center: { lat: coordinates.lat, lng: coordinates.lng },
                zoom: 12
            });

            new google.maps.Marker({
                position: { lat: coordinates.lat, lng: coordinates.lng },
                map: map,
                title: destination
            });
        }
    });

    async function getCoordinates(destination) {
        const apiKeyGoogle = 'AIzaSyCcAcZy5HSoyy1frqy9EQCZB1PEgF9EAE0';  // API do Google Maps
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=${apiKeyGoogle}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === 'OK') {
                return data.results[0].geometry.location;
            } else {
                throw new Error('Localização não encontrada');
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
});
