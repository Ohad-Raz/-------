// Function to fetch Hebcal API for a specific year and month
async function fetchHebcalAPI(year, month) {
  const apiUrl = `https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=${year}&month=${month}&ss=on&mf=on&c=on&city=Jerusalem&tzid=Asia/Jerusalem&lg=he`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data.items;
}

// Function to fetch Hebcal Converter API for a specific date
async function fetchHebcalConverterAPI(date) {
  const apiUrl = `https://www.hebcal.com/converter?cfg=json&date=${date}&g2h=1&strict=1`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

// Function to render monthly events in a card
function renderMonthlyEvents(year, month, events) {
  const monthContainer = document.createElement("div");
  monthContainer.className = "month-container";

  // Render the month header
  const headerElement = document.createElement("h3");
  headerElement.textContent = `חודש: ${month} - שנה: ${year}`;
  monthContainer.appendChild(headerElement);

  // Render daily events
  const eventsContainer = document.createElement("div");
  eventsContainer.className = "events-container";

  events.forEach(async (event) => {
    const eventElement = document.createElement("div");
    eventElement.className = "event-card";

    // Fetch Hebcal Converter API for each event date
    const converterData = await fetchHebcalConverterAPI(event.date);

    eventElement.innerHTML = `   
        <h3>${converterData.gd}/${converterData.gm}/${converterData.gy}</h3>
              <p>התאריך העברי : ${converterData.hebrew}</p>
              <hr>
            <p> ${event.title.join("<br>")}</p>
          
            <hr>
        `;
    eventsContainer.appendChild(eventElement);
  });

  // Initially hide the events container
  eventsContainer.style.display = "none";

  // Toggle button to show/hide events
  const toggleButton = document.createElement("button");
  toggleButton.textContent = "הצג/הסתר אירועים";
  toggleButton.addEventListener("click", () => {
    if (eventsContainer.style.display === "none") {
      eventsContainer.style.display = "block";
    } else {
      eventsContainer.style.display = "none";
    }
  });

  monthContainer.appendChild(toggleButton);
  monthContainer.appendChild(eventsContainer);
  document.body.appendChild(monthContainer);
}

// Loop through each month from January 2024 to December 2030
const startDate = new Date(2024, 0, 1); // January is 0-based
const endDate = new Date(2030, 11, 1); // December is 11-based

async function fetchData() {
  let currentDate = startDate;
  while (currentDate < endDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Adding 1 to get month in the range 1-12
    const events = await fetchHebcalAPI(year, month);
    renderMonthlyEvents(year, month, events);

    currentDate.setMonth(currentDate.getMonth() + 1);
  }
}

// Call the fetchData function
fetchData();
