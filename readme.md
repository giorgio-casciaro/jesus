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
- [ ] da transports a channels -> un channel contiene serialization (simple json,webpack) + compression (gzip)  + transport (udp, zeromq, http)
- [ ] getSharedConfig(service,submodule,...) diventa getNetConfig(service|*), getEventsIn(service|*), getEventsOut(service|*), getMethods(service|*)
- [ ] zeromq channel
- [ ] udp channel
- [ ] validator separato da client e server: si basa solo sullo schema json dei metodi dei services (tutte le chiamate rpc e gli eventi dovranno essere dichiarate prima dell'avvio del service)
