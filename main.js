function fetchHebcalAPI(year) {
  const apiUrl = `https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=${year}&month=x&ss=on&mf=on&c=on&city=Jerusalem&tzid=Asia/Jerusalem&lg=he`;

  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      renderYearHeader(year);
      renderDailyEvents(data.items);
      console.log(`Hebcal API Response for ${year}:`, data);
      return data;
    })
    .catch((error) => {
      console.error(`Error fetching Hebcal API for ${year}:`, error);
      throw error;
    });
}

function renderYearHeader(year) {
  const headerElement = document.createElement("h2");
  headerElement.textContent = `שנה : ${year}`;
  document.body.appendChild(headerElement);
}

function renderDailyEvents(events) {
  const eventsContainer = document.createElement("div");
  eventsContainer.className = "events-container";

  const eventsMap = new Map();

  events.forEach((event) => {
    const formattedDate = event.date.split("T")[0];
    if (!eventsMap.has(formattedDate)) {
      eventsMap.set(formattedDate, {
        date: formattedDate,
        hebrew: [event.hebrew],
        title: [event.title],
      });
    } else {
      // If the date already exists, accumulate the contents
      const existingEvent = eventsMap.get(formattedDate);
      existingEvent.hebrew.push(event.hebrew);
      existingEvent.title.push(event.title);
    }
  });

  eventsMap.forEach((event) => {
    const eventElement = document.createElement("div");
    eventElement.className = "event-card";

    eventElement.innerHTML = `   
        <h3>תאריך: ${event.date}</h3>
            <hr>
            <p> ${event.title.join("<br>")}</p>
            <hr>
        `;
    eventsContainer.appendChild(eventElement);
  });

  document.body.appendChild(eventsContainer);
}

const currentYear = new Date().getFullYear();
const endYear = 2032;

const yearsToFetch = Array.from(
  { length: endYear - currentYear + 1 },
  (_, index) => currentYear + index
);

for (const year of yearsToFetch) {
  fetchHebcalAPI(year);
}
