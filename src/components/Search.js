import React, { useState, useEffect } from 'react';  
import axios from 'axios';
import Body from './Body';


const APIKEY = "8d691032a91f21ca368ee8af35a7586e";

function SearchBar(){
    const [query, setQuery] = useState('London');
    const [data, setData] = useState({ hits: [] });
    const [search, setSearch] = useState('');
      
    useEffect(() => {
      const fetchData = async () => {
        const result = await axios(
            // `https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&APPID=${APIKEY}`,
            `https://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=${APIKEY}`,
        );

        setData(result.data);
      };

      fetchData();
    }, [query]);


    return(
      <div>
    <div class="form-outline">
      <input type="text" id="form1"  value= {query}  onChange={event => setQuery(event.target.value)}
      class="form-control" placeholder="Search City" aria-label="Search" />
      
    </div>
    <Body data={data} />
    </div>
)
}

export default SearchBar;

