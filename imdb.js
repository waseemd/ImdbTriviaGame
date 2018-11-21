var movies = [],
    rounds = [],
    ready = false;
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const url = 'https://www.imdb.com/chart/top';

function getTop250() { // using cheerio and node fetch to scrape imdb top 250
    return fetch(`${url}`)
       .then(response => response.text())
       .then(body => {
      var $ = cheerio.load(body, {});
            var _name, 
                _year; 
             $('.seen-collection').filter(function(){ // using cheerio to search through the html body
                var tableRow = $(this).find('.lister-list').find('tr');
                var i = 0;
                tableRow.each(function(){
                    var self = $(this);
                    i += 1;
                    var _name   = self.find('.titleColumn').find('a').text().trim();
                    var _year   = self.find('.titleColumn').find('.secondaryInfo').text().split(')')[0].split('(')[1].trim();
                
                    var data= {
                        index   :  i     , 
                        name    : _name ,
                        year   : _year  ,
                    };
                    movies.push(data);
                });
                exports.ready = true;
                ready = true;
            })
        return movies;     
   });
}

var setupRounds = function () { 
    for (var i = 1; i <= 8; i++) {
 
        // Get a random movie from the movie list
        var movie = movies[Math.floor(Math.random() * (movies.length / i))];

        var round = {
            number: i,
            title: movie.name,
            year: movie.year,
            answers: 0
        }

        rounds.push(round);
    }

    exports.rounds = rounds;
}

var clearRounds = function () {
    rounds = [];
    setupRounds();
    exports.rounds = rounds;
}


exports.getTop250 = getTop250;
exports.setupRounds = setupRounds;
exports.clearRounds = clearRounds;
exports.ready = ready;