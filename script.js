document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('travel-form');
    const summarySection = document.getElementById('summary');
    const summaryContent = document.getElementById('summary-content');
    
    form.addEventListener('submit', function(event) {
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
    });
});