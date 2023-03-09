const postnummer = 0000;

async function fetchHTML() {
  const apiurl = `https://www.posten.no/levering-av-post`;
  const resp = await fetch(apiurl);
  return resp.text();
}

async function findUrl() {
  try {
    response = await fetchHTML();
    const arr = response.split("data-component-url=");
    return arr[1].substring(0, arr[1].indexOf(" "));
  } catch (e) {
    return null;
  }
}

async function getData() {
  const url = await findUrl();
  if (url) {
    const apiurl = `https://posten.no${url}?postCode=${postnummer}`;
    const resp = await fetch(apiurl, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    return resp.json();
  }
  return null;
}

async function isPostToday() {
  const response = await getData();
  console.log(response);
  if (response && response.nextDeliveryDays && response.nextDeliveryDays[0]) {
    if (response.nextDeliveryDays[0].includes("i dag")) {
      return true;
    }
  }
  return false;
}

return await isPostToday();
