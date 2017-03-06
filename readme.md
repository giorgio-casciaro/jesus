## TODO IN TEST
- [X] evitare che un evento sia richiamato sul ms emitter
- [X] ripulire config
- [X] getConsole al post di LOG
- [X] debug attivo basato su config
- [X] inserimento log, al momento tutti debug
- [X] http streaming > aggiungere timeout alla chiusura della connessione
- [X] test aggiunta e rimozione eventi on the fly
- [X] test solo profiling: no tap solo request
- [X] eliminare astrazione storage(tenere solo inmemory per i test), storage gestito direttamente in microservice, le librerie come views e mutations si aspettano funzioni per l'inserimento e la lettura del db
- [X] eliminare astrazione entity.cqrs ->lavorare direttameten con view+mutations+ storage in methods
- [X] assicurarsi che tutti i file vengano ricaricati ogni 5 sec (json in config e methods)
- [X] Api request e Api response streamEvent in default events (non necessitano di configurazione in json)
- [ ] schemi generici-> error,httpReqMeta,netReqMeta, netMessage, netMessageMulti
- [ ] controllare schemi ms secondari: view potrebbero avere uno schema linkato alla resource principale e prevedere un filter dei parametri
- [ ] implementare pagina con script di console in express logs:LOG VISUALIZER->http streaming continuo,invia i vecchi log e si iscrive allo streaming
- [ ] allineare logs (multimessage deiverso da message)
- [ ] profiling e ottimizzazione cache locali: in methods utilizzare solo require con cache
- [ ] rivedere gestione errori, semplice console.error + throw

- [ ] dividere net in net, transport(grpc,http,udp), serialization (compression)

- [ ] net: sviluppare message e rpc basati su transport e serialization intercambiabile, events diventa una serie di rpc con funzioni extra
  - [ ] il message preserializzato dovrebbe contenere il contenuto + tipo di serializzazione
  - [ ] il message deserializzato dovrebbe contenere i meta + il body : tipo di transport, nome evento(opzionale), nome metodo, fromService, fromMethod,
- [ ] grpc diventa un transport di net  (server.grpc,server.grpc), net diventa un'unica classe che in futuro potrà ospitare più transport
- [ ] netClient aggiungere parametro throwOnErrorResponse a emit-> riconosce una riposta di errore (resolved ma con errore) e thow l'errore
- [ ] su config net: transports(http,grpc),serializations(noCompression,zlwCompression)
- [ ] su config event.listen: delay, prevalidation, prefilter
- [ ] su config method:
  - [ ] responseType (noResponse,aknolegment,response,stream), responseTimeout, responseSchema, responseSkipValidation
  - [ ] requestSchema, requestSkipValidation
  - [ ] privateMethod

## TODO SERVICE
NET

VIEWS
json diff

FRONT END CRUD
form autogenerati in base a json-schema
ms specializzato

FRONTEND
usare un global store (backup su browser store)
i dati vengono recuperati in 3modi
- tramite una query al servizio di view della Resource -> recupera tutti i dati e aggiorna il global store
- tramite una query differenziale al servizio di view della Resource -> usa l'ultimo timestamp per recuperare solo i dati aggiornati
- tramite servizio event emiter ->ogni componente ascolterà event emiter e muterà lo store di conseguenza


PERMESSI -> servizio can
  casi d'uso:
    - creare uno user:
      solo admin
    - creare una bacheca:
      se il numero di bacheche create non supera il massimo consentito e lo user è loggato (no role not logged)
    - creare un messaggio in bacheca:
      in base ai ruoli bacheca (in caso di mancata iscrizione assegnato no_subscription)
    - leggere un messaggio in bacheca:
      in base ai ruoli bacheca (generalmente si esclude no_subscription)
      in base agli user destinatari,gruppi destinatari
      in base all'autore (posso leggere i miei messaggi)
    - creare un commento a un messaggio in bacheca:
      in base ai ruoli bacheca (generalmente si esclude no_subscription)
      in base ai destinatari del messaggio parent
      in base all'autore del parent (posso commentare i miei messaggi)

  - can dovrebbe avere una struttura gerarchica per contesti
  es. il permesso di inviare un commento dipende
    > dal contesto messaggio che contiene il commento: il messaggio è pubblico o lo user è fra i destinatari ?
    > dal contesto bacheca che contiene il messaggio: lo user è iscritto alla bacheca?, il suo ruolo permette di scrivere commenti?
    > dal contesto app che contiene la bacheca: blacklist, superuser ecc.

    can(write.delete,'Comment',CommentID) ->il permesso viene richiesto al contesto 'Comment' (contesto parentID,parentTYPE vengono richiamati
    can(write.add.Comment,'Message',MessageID) ->il permesso viene richiesto al contesto parentID,parentTYPE
    can(write.add.Dashboard') ->il permesso viene richiesto al contesto null -> APP

  - la struttura gerarchica rende poco performante la gestione autonoma dei permessi da parte di ogni singolo microservice (molte chiamate verso parent obj), meglio un servizio autonomo
  - il servizio can dovrebbe basarsi su una view indipendente event based con solo i dati utili alle funzioni di permesso (destinatari messaggi, iscritti dashboards(dashboardId,UserId), gerarchie messaggi e moduli(parentId,parentType), )
  - il servizio can potrebbe unire authenticate , restituire i dati user e prendere il posto di "app" nella gerarchia
  - le varie funzioni accedono direttamente allo storage della view
  - le funzioni di permesso potrebbero essere sul registro delle entities



*/
