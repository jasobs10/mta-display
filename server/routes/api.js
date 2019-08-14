const express = require('express');
var ProtoBuf = require("protobufjs");
const router = express.Router();
var path = require('path');
const moment = require('moment');
const axios = require('axios');

const API = 'http://datamine.mta.info/mta_esi.php?key=11e436ba44a85d35ef64c4f601f2b19b';
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
  const uptownTimes = [];
  const downtownTimes = [];

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

    const time = moment().format('MMMM Do YYYY, h:mm:ss a');

    return { 
      uptownTimes: uptownTimes.sort(),
      downtownTimes: downtownTimes.sort(),
      lastUpdated: time
    };
}

module.exports = router;