import express from 'express'
const ipc = require('node-ipc');
var mqtt = require('mqtt')

const app = express()
var mosca = require('mosca')

var ascoltatore = {
  type: 'mongo',		
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  return_buffers: true,
  mongo: {}
};

var moscaSettings = {
  port: 1883,
  backend: ascoltatore,
  persistence: {
    factory: mosca.persistence.Mongo,
    url: 'mongodb://localhost:27017/mqtt'
  }
};

var server = new mosca.Server(moscaSettings);
var client  = mqtt.connect('mqtt://127.0.0.1:1883')

client.subscribe('topic', function (err) {
  if (!err) {
    setInterval(function(){
    client.publish('topic', 'message sended at ' + new Date());
    console.log("message sended at " + new Date());
    },100);
  }
});

  
// client.on('message', function (topic, message) {
//     client.publish('topic', 'Hello mqtt')

//    ipc.connectTo('interface-server', () => {
//        ipc.of['interface-server'].emit('payload', message.toString() + " at " + new Date());
//    });
// })

app.listen(3001, function(){
  ipc.config.id = 'mqtt-broker-client';
  ipc.config.retry = 1500;
  ipc.config.silent = true;
});