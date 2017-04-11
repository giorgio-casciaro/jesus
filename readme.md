# jesus

#### RPC
- Microservice 1
  - JesusClient EVENT : find services listening for event and loop rpc
    - JesusClient RPC : validate message and data (based on receiver method jsonschema), find right transport and send
      - ChannelClient : encode/compress message and send request
        - ChannelServer : receive request and decode/decompress message
          - JesusServer : receive message and call dervice method
            - Microservice 2 function



Msg (rpc call) = { Method, Data, Meta}

Method = method to call

Data = method data defined in jsonschema

Meta = { corrid, userid, from, reqInTimestamp, reqOutTimestamp, channel}

Channel = serialization (simple json,webpack) + compression (gzip)  + channel

Schema = share data schema between services


#### TODO IN TEST
- [x] da transports a channels -> un channel contiene serialization (simple json,webpack) + compression (gzip)  + transport (udp, zeromq, http)
- [x] getSharedConfig(service,submodule,...) diventa
  - getNetConfig(service|*)
  - getEventsIn(service|*)
  - getEventsOut(service|*)
  - getMethodsConfig(service|*)

- [x] rpc basata su schema statico in previsione di pretest
- [ ] testConnections -> testa la compatibilità fra i vari  jsonschema (service 1 out schema-> service2 in schema, service 1 in schema -> service2 out schema)
- [ ] zeromq channel
- [ ] udp channel
