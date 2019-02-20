# :bird: :earth_africa: Twitter_map :earth_africa: :bird:
## Progetto Reti Di Calcolatori
Roberto Aureli, Giulia Del Citto, Giorgia Di Pietro

Il progetto consiste nella realizzazione di un servizio REST accessibile via Web.

## Caratteristiche

* Il servizio REST implementato interfaccia due servizi REST esterni, cioè non su localhost.
* I servizi REST esterni commerciali utilizzati sono [Twitter](https://twitter.com/) e [Mapbox](https://www.mapbox.com/).
* Uno dei servizi REST esterni deve essere acceduto con OAuth (Twitter).
* Il servizio offre una chat implementata su WebSocket.

## Descrizione

Il progetto utilizza le API fornite da Twitter per cercare tweets e quelle di Mapbox per la ricerca su mappa.
Dato un hashtag, tramite API di Twitter otteniamo gli ultimi 100 tweet che lo contengono. Da questi vengono estratti quelli con dati sulla geolocalizzazione e riversati sulla mappa.
Nel bot è possibile ricevere i tweet più recenti contenenti l'hashtag richiesto, indipendentemente dal servizio di geolocalizzazione. Per poter accedere alla chat implementata attraverso WebSocket è necessario fare l'accesso tramite Twitter utilizzando il protocollo OAuth.

## API utilizzate

* [Twitter API](https://developer.twitter.com/)
* [Mapbox API](https://docs.mapbox.com/api/)


## Tecnologie usate

* [Node.js](https://nodejs.org/it/)
* [Nodemon](https://nodemon.io/)
* [Express](https://expressjs.com/)
* [Twitter for Node.js](https://www.npmjs.com/package/twitter)
* [Jade](http://jade-lang.com/)
* [Socket.io](https://socket.io/)

## /get_location
* **URL:** /get_location?city_name=\<nome_città\>

* **Metodo:** GET

*  **Parametri URL:** nome_città = [String]

* **Success Response:**
  * **Code:** 200 OK
  * **Content:** [latitudine,longitudine] Array JSON

* **Error Response:**

	* **Code:** 400 Bad Request  <br />
  * **Content:** [] Array JSON vuoto

* **Esempio:** GET localhost:8000/get_location?city_name=frosinone

## /get_location_reverse
* **URL:** /get_location_reverse?lat=\<latitudine\>&lng=\<longitudine\>

* **Metodo:** GET

*  **Parametri URL:** latitudine = [Int], longitudine = [Int]

* **Success Response:**
  * **Code:** 200 OK
  * **Content:** nome_città String

* **Error Response:**

	* **Code:** 400 Bad Request  <br />
  * **Content:** '' Stringa vuota

* **Esempio:** GET localhost:8000/get_location_reverse?lat=41.63333&lng=13.35

## /last_tweets

* **URL:** /last_tweets?N=\<num\>&hashtag=\<filtro\>

* **Metodo:** GET

*  **Parametri URL:** num = [Int], filtro = [String]

* **Success Response:**
  * **Code:** 200 OK
  * **Content:** ["Tweet1", "Tweet 2", "Tweet 3"] Array JSON

* **Error Response:**

	* **Code:** 400 Bad Request  <br />
  * **Content:** [] Array JSON vuoto

* **Esempio:** GET localhost:8000/last_tweets?N=3&hashtag=dog

