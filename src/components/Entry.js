import React, { useState, useEffect } from 'react';
import './Entry.css';
import axios from 'axios';
import apiKey from '../apikey';


function parseTrainNumber(trainData) {
  if(trainData) {
      const trainID = parseFloat(trainData);
      if(!isNaN(trainID)) {
          return trainID;
      }
  }
  return "TBD";
}

function showTime(time) {
  const hours = new Date(time).getHours();
  const minutes =new Date(time).getMinutes();
  let suffix = "AM";

  let showHours = `${hours}`;
  let showMinutes = `${minutes}`;

  if(hours > 11) {
      showHours = `${hours - 12}`;
      suffix = "PM";
  }
  if(hours === 0) {
      showHours = "12";
  }
  if(minutes < 10) {
      showMinutes = `0${minutes}`;
  }
  return `${showHours}:${showMinutes} ${suffix}`

}

function Entry(props) {

  const [ destination, setDestination ] = useState("");

  useEffect(() => {

    async function determineDestination(departureData) {
        let finalDestination = "";
        const tripData = departureData.relationships.trip.data.id;
        const destinationData = await axios.get(`https://api-v3.mbta.com/trips/${tripData}?api_key=${apiKey}`)
    
        finalDestination = destinationData.data.data.attributes.headsign;

        setDestination(finalDestination);
    }
    determineDestination(props.destinationData);

  }, [props.destinationData, destination]);


  return (
    <div className="entryRow">
      <div className="entryColumn"> MBTA </div>
      <div className="entryColumn"> {showTime(props.departTime)}</div>
      <div className="entryColumn"> {destination} </div>
      <div className="entryColumn"> {parseTrainNumber(props.trainNumber)} </div>
      <div className="entryColumn"> {props.trackNumber} </div>
      <div className="entryColumn"> {props.trainStatus} </div>
    </div>
  )
}

export default Entry
