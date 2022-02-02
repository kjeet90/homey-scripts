const postnummer = 0000;

const apiurl =
  "https://www.posten.no/levering-av-post/_/component/main/1/leftRegion/1?postCode=" +
  postnummer;

async function getData() {
  const resp = await fetch(apiurl, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  return resp.json();
}

const response = await getData();
function isPostToday() {
  if (response.nextDeliveryDays && response.nextDeliveryDays[0]) {
    if (response.nextDeliveryDays[0].includes("i dag")) {
      return true;
    }
  }
  return false;
}

return isPostToday();
