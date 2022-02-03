const startLimit = 5; //0-100% Eks: 5 --> Stops if humidity is 5% above average
const stopLimit = 2; // 0-100% Eks: 2 --> Stopper if humidity is less or equal to 2% over average.

const zoneName = "Bad hovedetasje";
const zonesToIgnore = ["Vaskerom", "Bad underetasje"];
const zoneValues = [];
const referenceValues = [];

return await run();

async function run() {
    if (zoneName) {
        return readHumidity();
    } else {
        return false;   
    }
}

async function readHumidity() {
    _.forEach(await getDevices(), (device) => {
        if (device.available && device.capabilitiesObj.measure_humidity && device.zoneName != zoneName && !zonesToIgnore.includes(device.zoneName)) {
            referenceValues.push(device.capabilitiesObj.measure_humidity.value);
        }
        else if (device.available && device.capabilitiesObj.measure_humidity && device.zoneName == zoneName) {
            zoneValues.push(device.capabilitiesObj.measure_humidity.value);
        }
    });
    return processHumidity();
}

async function processHumidity() {
    const averageReferenceValue = _.mean(referenceValues);
    const averageRoomValue = _.mean(zoneValues);
    if (averageRoomValue && averageReferenceValue) {
        console.log("Value at " + zoneName + ": " + averageRoomValue);
        console.log("Average reference: " + averageReferenceValue);
        console.log("");
        if (averageRoomValue - averageReferenceValue > startLimit) {
            setFan(true);
            console.log("Start: ", averageRoomValue - averageReferenceValue," > ",startLimit," --> ",averageRoomValue - averageReferenceValue > startLimit);
        } 
        else if (averageRoomValue - averageReferenceValue <= stopLimit) {
            setFan(false);
            console.log("Stop: ",averageRoomValue - averageReferenceValue," <= ",stopLimit," --> ",averageRoomValue - averageReferenceValue <= stopLimit);
        } else {
            console.log("Keep as is");
        }
        return true;
    }
    return false;
}

async function setFan(value) {
    _.forEach(await getDevices(), (device) => {
        if (device.available && device.zoneName == zoneName && device.virtualClass == "fan" && device.capabilitiesObj.onoff.value != value) {
        device.setCapabilityValue("onoff", value);
        }
    });
}

async function getDevices() {
    return await Homey.devices.getDevices();
}
