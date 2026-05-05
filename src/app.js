const express = require('express');
const bodyParser = require('body-parser');
const personsRouter = require('./routes/persons');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/persons', personsRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Phonebook API');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});