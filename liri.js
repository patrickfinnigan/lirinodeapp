require("dotenv").config();

const keys = require("./keys")
// remember to link the keys for your APIs and define the const "keys" for the api consts below!

var Twitter = require("twitter")
var inquire = require("inquirer")
var Spotify = require('node-spotify-api')
var request = require('request')

const spotify = new Spotify(keys.spotify);
const twitterClient = new Twitter(keys.twitter);
// remember to define "keys" with the require() property above!


inquire
    .prompt([{
        type: "list",
        message: "This is Liri! What do you want to do?",
        choices: ["Check my twitter", "Spotify this song", "Movie this", "Do what it says"],
        name: "command"
    }]).then((userInput) => {
            // console.log(userInput.command) 
            if (userInput.command === "Check my twitter") {
                // console.log("yeah");
                const params = {
                    screen_name: "PatrickFinnig10"
                }
                twitterClient.get('statuses/user_timeline', params, function (error, tweets) {
                    if (!error) {
                        for (let i = 0; i < tweets.length; i++) {
                            console.log(tweets[i].text);

                        }
                    }
                })
            } else if (userInput.command === "Spotify this song") {
                inquire
                    .prompt([{
                        type: "input",
                        message: "What song do you want to spotify?",
                        name: "song"
                    }]).then((userInput) => {
                        spotify.search({
                            type: 'track',
                            query: userInput.song,
                            limit: 5
                        }, function (err, data) {
                            if (err) {
                                return console.log('Error occurred: ' + err);
                            } else if (userInput.song === "") {
                                console.log("the sign by ace of base");



                            }
                            var songs = data.tracks.items

                            var getArtistNames = function (artist) {
                                return artist.name;
                            };

                            for (var i = 0; i < songs.length; i++) {
                                console.log(i);
                                console.log("artist(s): " + songs[i].artists.map(getArtistNames));
                                console.log("song name: " + songs[i].name);
                                console.log("preview song: " + songs[i].preview_url);
                                console.log("album: " + songs[i].album.name);
                                console.log("-----------------------------------");
                            }

                            // console.log(JSON.stringify(data.tracks.items[0], null, 2));
                        });
                    })
            } else if (userInput.command === "Movie this") {
                inquire
                    .prompt([{
                        type: "input",
                        message: "What movie do you want to watch?",
                        name: "movie"
                    }]).then((userInput) => {
                        

                        var urlHit = "http://www.omdbapi.com/?t=" + userInput.movie + "&y=&plot=full&tomatoes=true&apikey=trilogy";

                        request(urlHit, function(error, response, body) {
                          if (!error && response.statusCode === 200) {
                            var jsonData = JSON.parse(body);
                      
                            console.log("Title: " + jsonData.Title);
                            console.log("Year: " + jsonData.Year);
                            console.log("Rated: " + jsonData.Rated);
                            console.log("IMDB Rating: " + jsonData.imdbRating);
                            console.log("Country: " + jsonData.Country);
                            console.log("Language: " + jsonData.Language);
                            console.log("Plot: " + jsonData.Plot);
                            console.log("Actors: " + jsonData.Actors);
                            console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
                          }
                        });

                    });

        } else if (userInput.command === "Do what it says") {
            
        }
    })