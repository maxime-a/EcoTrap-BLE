/**
 * @ Author: Maxime Aymonin
 * @ Create Time: 2022-05-20 15:13:04
 * @ Modified by: Maxime Aymonin
 * @ Modified time: 2022-07-08 12:05:39
 * @ Description: A web interface to an EcoTrap
 */

/** Called on page load. Initialize the web page graphical components */
function onPageLoad()
{
    console.log(">> Initializing html components")

    // This will disable all the children of the div
    var nodes = document.getElementById("alarm1div").getElementsByTagName('*');
    for(var i = 0; i < nodes.length; i++){
        nodes[i].disabled = true;
    }

    // This will disable all the children of the div
    var nodes = document.getElementById("alarm2div").getElementsByTagName('*');
    for(var i = 0; i < nodes.length; i++){
        nodes[i].disabled = true;
    }
}
window.onPageLoad = onPageLoad();

/**
 * Read and return the actuators caracteristic
 */
async function readActuators(){
    var value = await characteristicActuators.readValue();
    let actuatorsWord = new Uint8Array(value.buffer);
    return actuatorsWord;
}

/**
 * Read and return the status caracteristic
 */
 async function readStatus(){
    var value = await characteristicStatus.readValue();
    let statusWord = new Uint8Array(value.buffer);
    return statusWord;
}

/**
 * Read and return the general caracteristic
 */
 async function readGeneral(){
    var value = await characteristicGeneral.readValue();
    let generalWord = new Uint8Array(value.buffer);
    return generalWord;
}

/**
 * Read and return the sensors caracteristic
 */
 async function readSensors(){
    var value = await characteristicSensors.readValue();
    let sensorsWord = new Uint8Array(value.buffer);
    return sensorsWord;
}

/**
 * Read and return the childs counter caracteristic
 */
async function readChildsCounter(){
    var value = await characteristicChilds.readValue();
    let childsWord = new Uint8Array(value.buffer);
    return childsWord;
}

/**
 * Initialise the text , color, etc... with the values readed just after connection
 */
async function globalInit()
{
    console.log(">> Initializing dashboard values and states")

    let generalWord = new Uint8Array(6);
    generalWord = await readGeneral();
  
    document.getElementById("networkID").innerHTML = "Network n°" + generalWord[2];
    document.getElementById("machineID").innerHTML = "Machine n°" + generalWord[3];

    let actuatorsWord = new Uint8Array(6);
    actuatorsWord = await readActuators();
    //check bits
    if(actuatorsWord[1]&0b00000001)
    {
        document.getElementById('fan-img').style.color = 'green';
        fanState=1;
    }
    else
    {
        document.getElementById('fan-img').style.color = 'var(--text-color)';
        fanState=0;
    }
    if(actuatorsWord[1]&0b00000010)
    {
        document.getElementById('co2-img').style.color = 'green';
        co2State=1;
    }
    else
    {
        document.getElementById('co2-img').style.color = 'var(--text-color)';
        co2State=0;
    }
    if(actuatorsWord[1]&0b00000100)
    {
        document.getElementById('light-img').style.color = 'green';
        lightState=1;
    }
    else
    {
        document.getElementById('light-img').style.color = 'var(--text-color)';
        lightState=0;
    }

    /* Status */
    let statusWord = new Uint8Array(2);
    statusWord = await readStatus();

    if(statusWord[1]&0b00000010)
    {
        modeState=1;
        document.getElementById('auto-img').style.color = 'green';
        lockers = document.getElementsByClassName("locker");
        for(let i=0;i<lockers.length;i++){lockers[i].style.visibility='visible';}
    }
    else
    {
        modeState=0;
        document.getElementById('auto-img').style.color = 'var(--text-color)';
        lockers = document.getElementsByClassName("locker");
        for(let i=0;i<lockers.length;i++){lockers[i].style.visibility='hidden';}
    }

    /* Configs */
    console.log(">> Initializing config values")

    let sensorsWord = new Uint8Array(20);
    sensorsWord = await readSensors();

    maxTemp = ((sensorsWord[16]*255 + sensorsWord[15])/10).toFixed(1);
    document.getElementById("temp-max-input").value = maxTemp;
    minTemp = ((sensorsWord[18]*255 + sensorsWord[17])/10).toFixed(1);
    document.getElementById("temp-min-input").value = minTemp;

    maxHum = sensorsWord[13];
    document.getElementById("hum-max-input").value = maxHum;
    minHum = sensorsWord[14];
    document.getElementById("hum-min-input").value = minHum;

    machineId = generalWord[3];
    document.getElementById("machine-input").value = machineId;
    networkId = generalWord[2];
    document.getElementById("network-input").value = networkId;
    childsCounter=generalWord[4]
    document.getElementById("childs-input").value = childsCounter;

    measurementsPeriod = sensorsWord[19];
    document.getElementById("measurements-input").value = measurementsPeriod;

    /* Position */
    console.log(">> Updating map")
    readPosition();
}

