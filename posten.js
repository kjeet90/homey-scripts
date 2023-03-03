const postnummer = 0000

async function getData(code) {
  const apiurl = `https://www.posten.no/levering-av-post/_/component/main/1/leftRegion/${code}?postCode=${postnummer}`;
  console.log(apiurl);
    const resp = await fetch(apiurl, {
      method: 'get',
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    return resp.json();
}

// Got sick of Posten.no changing the one number in the url and breaking it, so trying until success between 0-50.
for(let i = 0; i < 50; i++) {
  try {
    response = await getData(i);
    break;
  } catch(e) {
    response = { nextDeliveryDays: [] }
  }  
}

function isPostToday() {
  if(response.nextDeliveryDays && response.nextDeliveryDays[0]) {
    if(response.nextDeliveryDays[0].includes('i dag')) {
      return true;
    } 
  }
  return false;
}

return isPostToday();
