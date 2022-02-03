const yourAccessTokenFromTibberApiSite = "<insert-your-token-here>";
const lastRetrievedDate = global.get("TibberPrisIMorgenSisteDato");
log("lastRetrievedDate = " + lastRetrievedDate);
const tomorrowsDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
const tomorrowsDateString = tomorrowsDate.toISOString().substr(0, 10);
log(tomorrowsDateString);
if (lastRetrievedDate === tomorrowsDateString) {
  log("Data for i morgen er allerede oppdatert. Returnerer!");
  return true;
}
if (new Date().getHours() <= 11) {
  log("For tidlig på dagen. Ikke vits å sjekke mot Tibbers API");
  return false;
}
const graphQLQuery = {
  query:
    "{viewer{homes{currentSubscription{priceInfo{tomorrow{ total startsAt }}}}}}",
};
// Create the request
const res = await fetch("https://api.tibber.com/v1-beta/gql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + yourAccessTokenFromTibberApiSite,
  },
  body: JSON.stringify(graphQLQuery),
});
if (!res.ok) {
  throw new Error(res.statusText);
}
// Get the body JSON
const body = await res.json();
const toMorrowsArray =
  body.data.viewer.homes[0].currentSubscription.priceInfo.tomorrow;
// Hele array med totalpris og 'startsAt'
// log(todaysArray);
if (toMorrowsArray.length === 0) {
  log("No prices for tomorrow yet. Come back later");
  return false;
}
const priceArray = toMorrowsArray.map((r) => r.total);
// Array med kun priser for i morgen
// log(priceArray);
const max = Math.max(...priceArray);
log("max=" + max);
const min = Math.min(...priceArray);
log("min=" + min);
const sum = priceArray.reduce((a, b) => a + b, 0);
const avg = Math.round((100 * sum) / priceArray.length) / 100;
log("avg=" + avg);
await tag("TibberPrisIMorgenMax", max);
await tag("TibberPrisIMorgenMin", min);
await tag("TibberPrisIMorgenAvg", avg);
global.set("TibberPrisIMorgenSisteDato", tomorrowsDateString);
return true;
