# BalRunner

A web app that allows suers to find the near basketball court to them, currently it is limited to Ontario, Canada. Currently, I am implementing a matchmaking process which alows users 
to sign up, and get in queue to find someone to play basketball with. Once an oponent is found in your skill elvel range, we find a court that is convenient
for both of you. This feature is still being worked out, I plan to allow users to select a time, decline a match, and improve the algorithim so better matches are found.

## Getting Started

Make sure you have node installed on your system and clone this repo.


### Installing

instal dependencies for back-end
```
npm install
```

instal dependencies for front-end

```
npm install --prefix client
```
In one terminal run the server
```
npm run server
```

In another terminal start the front-end
```
cd client
npx gatsby develop
```

Vist [http://localhost:8000/](http://localhost:8000/) in your browser to see the site


## Acknowledgments
I used this [repo](https://github.com/jduyon/matchmaking/) here for the matchmaking algorithim. I modified it to fit what I want ballRunner to be able to do with it's matchmaking process.
