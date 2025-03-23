const express = require('express')
const path = require('path')
const { parse } = require('csv-parse/sync')
const fs = require('fs')
const app = express()
app.use(express.json())
const config = require('./public/config')

const flavor_texts = require('./public/flavour_texts')

const handed_in_flags = {}
const start_time = Date.now();

const flags = parse(fs.readFileSync(path.resolve('./flags.csv')), {columns: true, autoParse: true})

app.use(express.static('public'))

app.get("/", (req, res) => {
  res.sendFile(path.resolve('./index.html'))
})

app.get("/pandas", (req, res) => {
  res.send("ctf_12460658")
})

app.post("/submit", (req, res) => { 
  let { user, flag } = req.body
  user = user.slice(0, 16);
  flag = flag.slice(0, 16);
  if (!user) {
    res.send({
      accepted: false,
      reason: "No user provided"
    })
    return
  }
  if (!flag) {
    res.send({
      accepted: false,
      reason: "No flag provided"
    })
    return
  }

  // Create user if not yet exists
  if (!handed_in_flags[user]) handed_in_flags[user] = {};

  const flavor_text = flavor_texts[Math.floor(Math.random() * flavor_texts.length)];

  const f = flags.find(x => x.flag == flag) 
  if (f) {
    if(handed_in_flags[user][flag]) {
      res.send({
        accepted: false, 
        reason: "Flag already redeemed for user"
      })
      return
    }
    else {
      handed_in_flags[user][flag] = { time: Date.now(), score: parseInt(f.score) };
      res.send({ 
        accepted: true, 
        score: f.score,
        flavor_text, 
      })
      return
    }
  }
  else {
    res.send({
      accepted: false, 
      reason: "Unknown flag."
    })
    return
  }
})

app.get('/standings', (req, res) => { 
  const standings = Object.entries(handed_in_flags)
    .map(([user, score]) => ({
      user, 
      score: Object.values(score).reduce((acc, curr) => acc + curr.score, 0), 
      total_time: Math.round(Object.values(score).reduce((acc, curr) => acc + (curr.time - start_time), 0) / 1000)
    })) 
    .sort((a, b) => {
      if (a.score != b.score) return a.score - b.score
      return a.total_time - b.total_time
    })
  res.send(standings)
})

app.listen(config.PORT, () => {
  console.log("Listening on port ", config.PORT)
})