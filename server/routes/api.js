const express = require('express');
var ProtoBuf = require("protobufjs");
const router = express.Router();
var path = require('path');
const moment = require('moment');
const axios = require('axios');

const apiKey = process.env['MTA_API_KEY'];
const API = `http://datamine.mta.info/mta_esi.php?key=${apiKey}`;
var proto = path.resolve(__dirname + '/../data/nyct-subway.proto');
const transit = ProtoBuf.loadProtoFile(proto).build("transit_realtime");

router.get('/feed/:id', (req, res) => {
  const feedId = req.params.id;
  const uptown = req.query.uptown;
  const downtown = req.query.downtown;
  axios.get(`${API}`, {responseType: 'arraybuffer', params: {'feed_id': feedId}})
    .then(response => {
      const allTrains = transit.FeedMessage.decode(response.data).entity;
      const trainTimes = getTrainArrivals(uptown, downtown, allTrains);
      res.status(200).send(trainTimes);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error)
    });
});

function getTrainArrivals(uptownStopId, downtownStopId, trains) {
  let uptownTimes = [];
  let downtownTimes = [];

  Object.keys(trains)
    .forEach(trainId => {
      const trainData = trains[trainId];
      if (trainData.trip_update &&
          trainData.trip_update.stop_time_update &&
          trainData.trip_update.stop_time_update.length > 0) {
            trainData.trip_update.stop_time_update.forEach(timeUpdate => {

              if (timeUpdate.stop_id === uptownStopId || timeUpdate.stop_id === downtownStopId) {
                const arrivalTimeMs = timeUpdate.arrival.time;
                const timeNow = Date.now() / 1000;

                const elapsed = Math.floor((arrivalTimeMs - timeNow) / 60);
                if (elapsed < 0) {
                  return;
                }
      
                if (timeUpdate.stop_id === uptownStopId) {
                  uptownTimes.push(elapsed);
                } else {
                  downtownTimes.push(elapsed);
                }
              }
            });
          }
    });

    const time = moment().format('h:mm:ss a').toString();
    uptownTimes = uptownTimes.sort((a, b) => a - b).slice(0, 3);
    downtownTimes = downtownTimes.sort((a, b) => a - b).slice(0, 3);

    return { 
      uptownTimes,
      downtownTimes,
      lastUpdated: time
    };
}

module.exports = router;