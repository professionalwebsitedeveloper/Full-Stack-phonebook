const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, '..', 'db.json');

const readPersons = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const writePersons = (persons) => fs.writeFileSync(dbPath, JSON.stringify(persons, null, 2));

app.get('/', (req, res) => {
  res.send('<h1>Phonebook Backend</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(readPersons())
})

app.get('/info', (req, res) => {
  const persons = readPersons()
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const person = readPersons().find(p => p.id === req.params.id)
  if (person) res.json(person)
  else res.status(404).json({ error: 'not found' })
})

app.delete('/api/persons/:id', (req, res) => {
  const persons = readPersons().filter(p => p.id !== req.params.id)
  writePersons(persons)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body
  if (!name || !number) return res.status(400).json({ error: 'name or number missing' })
  const persons = readPersons()
  if (persons.find(p => p.name === name)) return res.status(400).json({ error: 'name must be unique' })
  const person = { id: String(Math.floor(Math.random() * 1000000)), name, number }
  persons.push(person)
  writePersons(persons)
  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})