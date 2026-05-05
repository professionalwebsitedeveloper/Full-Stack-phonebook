const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../../db.json');

// Get all persons
router.get('/', (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read database' });
        }
        res.json(JSON.parse(data));
    });
});

// Get a person by ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read database' });
        }
        const persons = JSON.parse(data);
        const person = persons.find(p => p.id === id);
        if (person) {
            res.json(person);
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    });
});

// Create a new person
router.post('/', (req, res) => {
    const newPerson = req.body;
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read database' });
        }
        const persons = JSON.parse(data);
        persons.push(newPerson);
        fs.writeFile(dbPath, JSON.stringify(persons, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save person' });
            }
            res.status(201).json(newPerson);
        });
    });
});

// Update a person by ID
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedPerson = req.body;
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read database' });
        }
        let persons = JSON.parse(data);
        const index = persons.findIndex(p => p.id === id);
        if (index !== -1) {
            persons[index] = { ...persons[index], ...updatedPerson };
            fs.writeFile(dbPath, JSON.stringify(persons, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update person' });
                }
                res.json(persons[index]);
            });
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    });
});

// Delete a person by ID
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read database' });
        }
        let persons = JSON.parse(data);
        persons = persons.filter(p => p.id !== id);
        fs.writeFile(dbPath, JSON.stringify(persons, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete person' });
            }
            res.status(204).end();
        });
    });
});

module.exports = router;