import React, { useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WindPowerIcon from '@mui/icons-material/WindPower';
import Box from '@mui/material/Box';
import "bootstrap/dist/css/bootstrap.css";

function Weather(){

  // State
  const [apiData, setApiData] = useState({});
  const [getState, setGetState] = useState('Nairobi');
  const [state, setState] = useState('Nairobi');

  // API KEY AND URL

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${state}&appid={APIKEY}&units=metric`


  // Side effect
  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setApiData(data));
  }, [apiUrl]);

  const inputHandler = (event) => {
    setGetState(event.target.value);
  };

  const submitHandler = () => {
    setState(getState);
  };

  return(
    <div class="container-fluid">
    <div class="row justify-content-center">
        <div class="col-12 col-md-4 col-sm-12 col-xs-12">
            <div class="row">
                <div class="col-9 p-3">
                    <div class="form-outline">
                        <input type="text" id="form1"   onChange={inputHandler} value={getState}
                        class="form-control" placeholder="Search City" aria-label="Search" />
                    </div>
                    
                </div> 

                <div  class="col-2 p-3" >
                    <button type="button" class="btn btn-primary" onClick={submitHandler}>Search</button>
                </div>
            </div>
            {
                  apiData.main ? (
               <div class="card p-4"> 
                    <div class="d-flex">
                    <h6 class="flex-grow-1">{apiData.name} , {apiData.sys.country}</h6>
                    <h6> {new Date().toLocaleTimeString()}</h6>
                </div>
                 
                <p class="my-1">
                 
                      <DeviceThermostatIcon / >
                    <span> {apiData.main.temp}&deg; C </span>
                    
                </p>
                
                <div class="d-flex">
                    <div class="temp-details flex-grow-1">
                 <p class="my-1">
                         
                     <svg xmlns="http://www.w3.org/2000/svg"  width="35" height="35" viewBox="0 0 48 48"><path fill="#ffc239" d="M39 24a15.005 15.005 0 0 1-25.61 10.61 1.015 1.015 0 0 1-.13-.18.998.998 0 0 1-.16-.53 1.052 1.052 0 0 1 .29-.71l19.8-19.8a1.014 1.014 0 0 1 1.42 0A15.06 15.06 0 0 1 39 24Z"/><path fill="#ffe266" d="M38.65 20.79A27.151 27.151 0 0 1 15.04 34.5c-.6 0-1.19-.02-1.78-.07a.998.998 0 0 1-.16-.53 1.052 1.052 0 0 1 .29-.71l19.8-19.8a1.014 1.014 0 0 1 1.42 0 14.914 14.914 0 0 1 4.04 7.4Z"/><path fill="#ffc239" d="M44 25h-2a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2zm-5.857 14.143a.997.997 0 0 1-.707-.293l-1.415-1.415a1 1 0 0 1 1.414-1.414l1.415 1.415a1 1 0 0 1-.707 1.707zM24 45a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1z"/><path fill="#333" d="m34.56 14.8-6.02 6.03a1.007 1.007 0 0 1-.71.29H10.88a5.13 5.13 0 0 1-1.66-9.99q-.03-.33-.03-.66A7.898 7.898 0 0 1 22.9 5.13a6.366 6.366 0 0 1 2.24-.47 1.62 1.62 0 0 1 .22-.01 6.528 6.528 0 0 1 6.52 6.49 5.01 5.01 0 0 1 2.86 2.51.987.987 0 0 1-.18 1.15Z"/><path fill="#4d4d4d" d="M25.14 4.66a22.113 22.113 0 0 1-9.32 16.46h-4.94a5.13 5.13 0 0 1-1.66-9.99q-.03-.33-.03-.66A7.898 7.898 0 0 1 22.9 5.13a6.366 6.366 0 0 1 2.24-.47Z"/><path fill="#4fd7f7" d="M13.507 25.94a1 1 0 0 1-.94-1.342l.533-1.466a1 1 0 0 1 1.88.683l-.533 1.466a1 1 0 0 1-.94.659zm-2.133 5.86a1 1 0 0 1-.94-1.342l1.066-2.93a1 1 0 0 1 1.88.683l-1.066 2.93a1 1 0 0 1-.94.659zm-2.796-4.396a1 1 0 0 1-.94-1.342l1.066-2.93a1 1 0 0 1 1.88.683l-1.066 2.931a1 1 0 0 1-.94.658zm-1.6 4.396a1 1 0 0 1-.94-1.343l.534-1.465a1 1 0 0 1 1.88.686l-.534 1.465a1 1 0 0 1-.94.657zm9.659-4.396a1 1 0 0 1-.94-1.342l1.066-2.93a1 1 0 0 1 1.88.683l-1.066 2.931a1 1 0 0 1-.94.658z"/><path fill="#4d4d4d" d="M4 45a1 1 0 0 1-.707-1.707l40-40a1 1 0 1 1 1.414 1.414l-40 40A.997.997 0 0 1 4 45Z"/></svg>
                     <span class="small grey">{apiData.weather[0].main}</span>
                     </p>
                         <p class="my-1">
                             
                          <WindPowerIcon />
     
                            <span> {apiData.wind.speed} km/hr </span>
                         </p>

                         <p class="my-1"> 
                            
<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" data-name="Layer 1" viewBox="0 0 25 25"><path d="M12.5 20.5a2.61 2.61 0 0 1-2.6-2.6c0-1.23 1.8-4.5 2.16-5.15a.53.53 0 0 1 .88 0c.36.65 2.16 3.92 2.16 5.15A2.61 2.61 0 0 1 12.5 20.5zm0-6.45a14.67 14.67 0 0 0-1.6 3.85 1.6 1.6 0 0 0 3.2 0A14.67 14.67 0 0 0 12.5 14.05zM9.5 13.5a2 2 0 0 1-2-2c0-.91 1.3-3.28 1.56-3.75a.53.53 0 0 1 .88 0c.26.47 1.56 2.84 1.56 3.75A2 2 0 0 1 9.5 13.5zm0-4.44a9.23 9.23 0 0 0-1 2.44 1 1 0 0 0 2 0A9.23 9.23 0 0 0 9.5 9.06zM14.5 11.5a2 2 0 0 1-2-2c0-.91 1.3-3.28 1.56-3.75a.53.53 0 0 1 .88 0c.26.47 1.56 2.84 1.56 3.75A2 2 0 0 1 14.5 11.5zm0-4.44a9.23 9.23 0 0 0-1 2.44 1 1 0 0 0 2 0A9.23 9.23 0 0 0 14.5 7.06z"/></svg>
                            <span> {apiData.main.humidity} % </span> 
                         </p>

                         <p class="my-1"> 
                             
<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 32 32"><g fill="#101820" data-name="15-tire-pressure"><path d="M18 30a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1zm4 0a1 1 0 0 1-1-1v-3a1 1 0 0 1 2 0v3a1 1 0 0 1-1 1zm-8 0a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1zm-4 0a1 1 0 0 1-1-1v-3a1 1 0 0 1 2 0v3a1 1 0 0 1-1 1z"/><path d="M16 28A12 12 0 0 1 9 6.26V3a1 1 0 0 1 2 0v3.79a1 1 0 0 1-.45.84 10 10 0 1 0 10.91 0 1 1 0 0 1-.46-.84V3a1 1 0 0 1 2 0v3.26A12 12 0 0 1 16 28Z"/><path d="M16 17a1 1 0 0 1-1-1v-6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1zm0 6a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1z"/></g></svg>
                             <span> {apiData.main.pressure} hPa </span>
                         </p>
                         <p class="my-1">
                             <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-sunrise-fill" viewBox="0 0 16 16">
                             <path d="M7.646 1.146a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708L8.5 2.707V4.5a.5.5 0 0 1-1 0V2.707l-.646.647a.5.5 0 1 1-.708-.708l1.5-1.5zM2.343 4.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                             </svg>
                             <span> {new Date(apiData.sys.sunrise * 1000).toLocaleTimeString()} </span>
                         </p>
                         <p class="my-1"> 
                             
                             <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-sunset-fill" viewBox="0 0 16 16">
                             <path d="M7.646 4.854a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V1.5a.5.5 0 0 0-1 0v1.793l-.646-.647a.5.5 0 1 0-.708.708l1.5 1.5zm-5.303-.51a.5.5 0 0 1 .707 0l1.414 1.413a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .706l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                             </svg>
                             <span>  {new Date(apiData.sys.sunset * 1000).toLocaleTimeString()}</span>
                         </p>
                    </div>
                    
                    <div>
                                         <img src={ "http://openweathermap.org/img/wn/" +
                 `${apiData.cod != 404 ? apiData.weather[0].icon : null}` +
                 ".png"}width="100px" / >
                    </div>
              

                   </div>
                   
                </div>
            ):(
              <Box sx={{ width: '100%' }}>
                <LinearProgress />
             </Box>
            )  
              } 
        </div>
    </div>
</div>
  )
}

export default Weather;