## TODO IN TEST
- [X] evitare che un evento sia richiamato sul ms emitter
- [X] ripulire config
- [X] getConsole al post di LOG
- [X] debug attivo basato su config
- [X] inserimento log, al momento tutti debug
- [X] http streaming > aggiungere timeout alla chiusura della connessione
- [X] test aggiunta e rimozione eventi on the fly
- [X] test solo profiling: no tap solo request
- [ ] implementare pagina con script di console in express logs:LOG VISUALIZER->http streaming continuo,invia i vecchi log e si iscrive allo streaming
- [ ] allineare logs (multimessage deiverso da message)
- [ ] assicurarsi che tutti i file vengano ricaricati quando richiamati (json in config e methods)
- [ ] eliminare funzioni anonime (non comprensibili in profiling)
- [ ] astrarre classe storage -> query complessemediante accesso diretto ai db

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
