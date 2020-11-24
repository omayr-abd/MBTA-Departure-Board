import React, {useState, useEffect} from 'react';
import './Board.css';
import Entry from './Entry';
import axios from 'axios';
import apiKey from '../apikey';

const NStationQuery = "stop=place-north&route=CR-Fitchburg,CR-Haverhill,CR-Lowell,CR-Newburyport"
const SStationQuery = "stop=place-sstat&route=CR-Greenbush,CR-Middleborough,CR-Kingston,CR-Fairmount,CR-Franklin,CR-Worcester,CR-Providence,CR-Needham";


function Board(props) {
  const [data, setData] = useState({ data: []});

  useEffect(() => {
    async function fetchData() {
      const result = await axios.get(`https://api-v3.mbta.com/predictions/?api_key=${apiKey}&${(props.station === "North Station")?(NStationQuery):(SStationQuery)}`);
      console.log(result)
      if (result) {
        // filter only on entries with a valid departure time.
        const filteredResult = result.data.data.filter((elem) => {
          return (elem.relationships.stop.data.id.includes(props.station)) && (elem.attributes.departure_time !== null ? true : false);
        })
        // sort predictions to appear in order of departure time
        const sortedResult = filteredResult.sort((a, b) => {
            return new Date(a.attributes.departure_time).getTime() - new Date(b.attributes.departure_time).getTime();
        });
        //console.log(sortedResult)
        setData(sortedResult);
      }
    }

    fetchData();


    // refresh every 60 sec
    const refresh = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(refresh);

  }, [props.station]);

  //console.log(data); 
  if (data && data.length) {
    //console.log(data); 
    return (
      <div className="stationBoard">
        <div className="heading"> {props.station} Departure Board</div>
        <div className="titleRow">
          <div className="titleColumn">Carrier</div>
          <div className="titleColumn">Time</div>
          <div className="titleColumn">Destination</div>
          <div className="titleColumn">Train#</div>
          <div className="titleColumn">Track#</div>
          <div className="titleColumn">Status</div>
        </div>
        {
          data.map((elem) => {
            const stationData = elem.relationships.stop.data.id.split('-');
            const departTime = elem.attributes.departure_time;
            const trainNumber = elem.relationships.trip.data.id.split('-')[4];
            const trackNumber = (stationData.length > 1)?(parseFloat(stationData[1])):("TBD");
            const trainStatus = elem.attributes.status;
            return (
                <Entry key={elem.id} departTime={departTime} destinationData={elem} trainNumber={trainNumber} trackNumber={trackNumber} trainStatus={trainStatus} />
            );
          })
        }
      </div>
    );
  } else {
    return (
      <div className="stationBoard">
        <div className="heading">
          <div className="heading">{props.station} Departure Board</div>
        </div>
      </div>
    );
  }
}

export default Board;
