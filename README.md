IMDb Trivia Game
==============

You are required to develop a simple movie trivia PWA. 

The task should take no longer than 8 hours. 

The 'Movie Night Trivia' mobile-first PWA needs to allow two players to play on separate devices. 

Once connected, the players are each presented with a random movie title from IMDB’s top 250 list and asked to guess the year it was released. A game consists of 8 rounds with 5 points allocated for a correct answer and -3 for an incorrect answer. 

The player with the highest score at the end of the game wins. The game needs to be real-time and rely on a RESTful API which scrapes the movie data from: http://www.imdb.com/chart/top?ref_=nb_mv_3_chttp 

Include notes on how to run your solution and any other info(assumptions, known bugs, etc.) 

The PWA should be launched using Node.js and utilise socket.io. Frontend can be in either AngularJS or React

Installation
=============

First, you need to make sure you have node.js up and running ([nodejs.org](http://nodejs.org/))

Download this repository to your local environment amd then in the folder, go to your command line and run npm install to install the required modules. Once this is done you can run npm start in your command line, and then go to http://localhost:3000 in your browser. 

Known Issues / Assumptions
==========================

This site uses scraper as per spec, and the limitation is that the scraper is dependent on the site's, which is being scraped, html structure doesn't change. While an API would be better, there are no official APIs for IMDB
