## TODO IN TEST
- [ ] dividere jesus in sharedSchema, net e cqrs
- [ ] controllare schemi ms secondari: view potrebbero avere uno schema linkato alla resource principale e prevedere un filter dei parametri
- [ ] implementare pagina con script di console in express logs:LOG VISUALIZER->http streaming continuo,invia i vecchi log e si iscrive allo streaming
- [ ] profiling e ottimizzazione cache locali: in methods utilizzare solo require con cache

- [ ] documentation dei metodi pubblici in jsonschema
- [ ] ripulire config in testservicesnet
- [X] rivedere gestione errori, semplice console.error + throw
- [X] log show correlation id
- [X] dividere net in net e transport(grpc,http,udp)

###net: sviluppare message e rpc basati su transport e serialization intercambiabile, events diventa una serie di rpc con funzioni extra
- [ ] migliore gestione message con multi call, gestire come eccezione, di base messaggio semplice
- [ ] migliore gestione dei log, non usare event *, ma modificare CONSOLE.log e aggiungere un log a event
- [ ] delayed in preferenze method ricevente + rpc attrs
- [ ] validate in net, anche che per transports (message in, response, errorResposne)
- [ ] netClient aggiungere parametro throwOnErrorResponse a emit-> riconosce una riposta di errore (resolved ma con errore) e thow l'errore
- [ ] zeromq transport
- [ ] udp transport
- [X] preferedTransports in net (non nei singoli metodi)
- [X] events definiti indipendentemente da methods
- [X] test net con solo fake transport, test specifici per ogni transport
- [X] transports sperarati da gestione eventi



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
