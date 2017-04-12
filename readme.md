# jesus
Javascript Microservice Comunication Manager:
jesus is a cross-service multichannel (http,tcp,upd) comunication (rpc, events) layer

FEATURE: various response type: noResponse, aknowlegment, response, stream
FEATURE: various channels udp,http,socket (channel=tranport+serialization+compression, es http=rest+plain+compression)
FEATURE: event transport is choosed based on event/rpc config (ex. log event on udp, domain event on http/rest)
REQUIRE: schema manager, a way to share info between microservice (etcd,consul,memcache,redis,ecc)
TODO: All requests and responses (for rpc and events) are described with jsonschema and the compatibility between microservice is tested at start
TODO: channels based on zeromq
TODO: comunication between microservice and jesus based on unixsocket: not npm module require, language agnostic comunication, deployable on kubernetes as Daemonset (one jesus server per node, comunication based on unixsocket)

#### RPC
- Microservice 1
  - JesusClient EVENT : find services listening for event and loop rpc
    - JesusClient RPC : validate message and data (based on receiver method jsonschema), find right transport and send
      - ChannelClient : encode/compress message and send request
        - ChannelServer : receive request and decode/decompress message
          - JesusServer : receive message and call dervice method
            - Microservice 2 function


#### OBJS
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

  <img src="https://cdn.rawgit.com/giorgio-casciaro/jesus/master/svg/test.svg">
