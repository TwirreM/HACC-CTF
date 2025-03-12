const express = require('express')
const path = require('path')
const app = express()
app.use(express.json())
const config = require('./public/config')

const flags = require('./flags')
const flavor_texts = require('./public/flavour_texts')

const handed_in_flags = {}
const start_time = Date.now();

app.use(express.static('public'))

app.get("/", (req, res) => {
  res.sendFile(path.resolve('./index.html'))
})

app.post("/submit", (req, res) => { 
  const { user, flag } = req.body
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

  if (flags.includes(flag)) {
    if(handed_in_flags[user][flag]) {
      res.send({
        accepted: false, 
        reason: "Flag already redeemed for user"
      })
      return
    }
    else {
      handed_in_flags[user][flag] = Date.now();
      res.send({ 
        accepted: true, 
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
      score: Object.keys(score).length, 
      total_time: Object.values(score).reduce((acc, curr) => acc + (curr - start_time), 0)
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