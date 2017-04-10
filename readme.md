#jesus

##Schema
Microservice 1 send ->
  jesus client send (rpcCall) ->
    channel client send (message) ->
    channel server receive (message) ->
  jesus server receive (rpcCallRequest) ->
Microservice 2 receive (methodCall)

Channel = validation (data schema comparation) + serialization (simple json,webpack) + compression (gzip)  + transport
Schema = share data schema between services


## TODO IN TEST
- [ ] da transports a channels -> un channel contiene serialization (simple json,webpack) + compression (gzip)  + transport (udp, zeromq, http)
- [ ] getSharedConfig(service,submodule,...) diventa
  - getServiceMethods(serviceName)
  - getServicesNetConfig(serviceName|*) -> NetConfig contiene channels, listenEvents, emitEvents, rpcCalls, (come gestire le chiamate rpc in prevalidation? )
- [ ] zeromq channel
- [ ] udp transport
- [ ] profiling e ottimizzazione cache locali: in methods utilizzare solo require con cache
- [ ] validator separato da client e server: si basa solo sullo schema json dei metodi dei services (tutte le chiamate rpc e gli eventi dovranno essere dichiarate prima dell'avvio del service)
