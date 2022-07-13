/**
 * @ Author: Maxime Aymonin
 * @ Create Time: 2022-07-02 12:01:52
 * @ Modified by: Maxime Aymonin
 * @ Modified time: 2022-07-02 12:03:40
 * @ Description: Dashboard part of the web interface to an EcoTrap
 */

/**
 * On fan button click toggle between on and off
 */
 async function fan()
 {
     let actuatorsWord = new Uint8Array(2);
   
     console.log('>> Reading actuators');
     actuatorsWord = await readActuators();
     console.log('>> Actuators readed');
     console.log(actuatorsWord);
 
     if(!modeState)
     {
         if(!fanState)
         {
             fanState=1;
             document.getElementById('fan-img').style.color = 'green';
             actuatorsWord[1]=0x01 | actuatorsWord[1];
         }
         else
         {
             fanState=0;
             document.getElementById('fan-img').style.color = 'var(--text-color)';
             actuatorsWord[1]=0b11111110 & actuatorsWord[1];
         }
     }
 
     console.log('>> Writing actuators caracteristic');
     console.log(actuatorsWord);
     try{
       await characteristicActuators.writeValue(actuatorsWord);
     }
     catch(error){
       console.log('/!\ Failed writing actuators caracteristic' + error);
     }
 }
 
 /**
  * On co2 button click toggle between on and off
  */
 async function co2()
 {
     let actuatorsWord = new Uint8Array(2);
   
     console.log('>> Reading actuators');
     actuatorsWord = await readActuators();
     console.log('>> Actuators readed');
     console.log(actuatorsWord);
 
     if(!modeState)
     {
         if(!co2State)
         {
             co2State=1;
             document.getElementById('co2-img').style.color = 'green';
             actuatorsWord[1]=0x02 | actuatorsWord[1];
         }
         else
         {
             co2State=0;
             document.getElementById('co2-img').style.color = 'var(--text-color)';
             actuatorsWord[1]=0b11111101 & actuatorsWord[1];
         }
     }
 
     console.log('>> Writing actuators caracteristic');
     console.log(actuatorsWord);
     try{
       await characteristicActuators.writeValue(actuatorsWord);
     }
     catch(error){
       console.log('/!\ Failed writing actuators caracteristic' + error);
     }
 }
 
 /**
  * On light button click toggle between on and off
  */
 async function light()
 {
     let actuatorsWord = new Uint8Array(2);
   
     console.log('>> Reading actuators');
     actuatorsWord = await readActuators();
     console.log('>> Actuators readed');
     console.log(actuatorsWord);
 
     if(!modeState)
     {
         if(!lightState)
         {
             lightState=1;
             document.getElementById('light-img').style.color = 'green';
             actuatorsWord[1]=0x04 | actuatorsWord[1];
         }
         else
         {
             lightState=0;
             document.getElementById('light-img').style.color = 'var(--text-color)';
             actuatorsWord[1]=0b11111011 & actuatorsWord[1];
         }
     }
 
     console.log('>> Writing actuators caracteristic');
     console.log(actuatorsWord);
     try{
       await characteristicActuators.writeValue(actuatorsWord);
     }
     catch(error){
       console.log('/!\ Failed writing actuators caracteristic' + error);
     }
 }
 
 /**
  * On auto button click toggle between on and off
  */
 async function modeAuto()
 {
     let statusWord = new Uint8Array(2);
   
     console.log('>> Reading status');
     statusWord = await readStatus();
     console.log('>> status readed');
     console.log(statusWord);
 
     if(!modeState)
     {
         modeState=1;
         document.getElementById('auto-img').style.color = 'green';
         lockers = document.getElementsByClassName("locker");
         for(let i=0;i<lockers.length;i++){lockers[i].style.visibility='visible';}
         statusWord[1]=0x02 | statusWord[1];
     }
     else
     {
         modeState=0;
         document.getElementById('auto-img').style.color = 'var(--text-color)';
         lockers = document.getElementsByClassName("locker");
         for(let i=0;i<lockers.length;i++){lockers[i].style.visibility='hidden';}
         statusWord[1]=0b11111101 & statusWord[1];
     }
 
     console.log('>> Writing status caracteristic');
     console.log(statusWord);
     try{
       await characteristicStatus.writeValue(statusWord);
     }
     catch(error){
       console.log('/!\ Failed writing actuators caracteristic' + error);
     }
 }
 
 /**
  * Handle measurements notification
  */
 function handleDataMeasurements(event) {
     // get the data buffer from the event
     var buf = new Uint8Array(event.target.value.buffer);
     // debug trace
     console.log(">> Measurements data received : ")
     // convert bytes to corresponding values
     temperature = (buf[17]*255+buf[18])/10;
     humidity = buf[19];
     mosquito = buf[12];
     // update UI
     document.getElementById('temperature-value').innerHTML  =   temperature.toFixed(1).toString() + '°C';
     document.getElementById('humidity-value').innerHTML     =   humidity.toString() + '%';
     document.getElementById('mosquitoes-value').innerHTML   =   mosquito.toString();
 }
 
 /**
  * Handle actuators notification
  */
  function handleActuatorsNotif(event) {
     // get the data buffer from the event
     var buf = new Uint8Array(event.target.value.buffer);
     // debug trace
     console.log(">> Actuators data received : ")
     console.log(buf)
     //check bits
     if(buf[1]&0b00000001)
     {
         document.getElementById('fan-img').style.color = 'green';
     }
     else
     {
         document.getElementById('fan-img').style.color = 'var(--text-color)';
     }
     if(buf[1]&0b00000010)
     {
         document.getElementById('co2-img').style.color = 'green';
     }
     else
     {
         document.getElementById('co2-img').style.color = 'var(--text-color)';
     }
     if(buf[1]&0b00000100)
     {
         document.getElementById('light-img').style.color = 'green';
     }
     else
     {
         document.getElementById('light-img').style.color = 'var(--text-color)';
     }
 }