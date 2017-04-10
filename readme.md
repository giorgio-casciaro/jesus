#jesus

##Schema
Microservice 1 send ->
  jesus client send (rpcCall) ->
    channel client send (message) ->
    channel server receive (message) ->
  jesus server receive (rpcCallRequest) ->
Microservice 2 receive (methodCall)

Channel = validation (data schema comparation) + serialization (simple json,webpack) + compression (gzip)  + channel
Schema = share data schema between services


## TODO IN TEST
- [X] da transports a channels -> un channel contiene serialization (simple json,webpack) + compression (gzip)  + transport (udp, zeromq, http)
- [X] getSharedConfig(service,submodule,...) diventa
  - getNetConfig(service|*)
  - getEventsIn(service|*)
  - getEventsOut(service|*)
  - getMethodsConfig(service|*)


- [ ] testConnections -> testa la compatibilità fra i vari  jsonschema (service 1 out schema-> service2 in schema, service 1 in schema -> service2 out schema)
- [ ] zeromq channel
- [ ] udp channel
