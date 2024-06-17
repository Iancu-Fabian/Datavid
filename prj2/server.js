const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

let members = [];


const findExistingMember = (firstName, lastName, city) => {
    return members.find(member =>
        member.firstName === firstName &&
        member.lastName === lastName ||
        member.city === city
    );
};

app.post('/api/members', (req, res) => {
    const { firstName, lastName, birthDate, country, city } = req.body;

   
    if (!firstName || !lastName || !birthDate || !country || !city) {
        return res.status(400).json({ message: 'All fields are mandatory' });
    }

    
    if (findExistingMember(firstName, lastName, city)) {
        return res.status(400).json({ message: 'Member with the same first name, last name, and city already exists' });
    }


    if (members.some(member =>
        member.firstName === firstName &&
        member.lastName === lastName
    )) {
        return res.status(400).json({ message: 'A member with the same first name and last name already exists' });
    }

   
    const age = Math.floor((new Date() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    if (age < 18) {
        return res.status(400).json({ message: 'Member must be at least 18 years old' });
    }

    const newMember = { firstName, lastName, birthDate, country, city };
    members.push(newMember);
    res.status(201).json(newMember);
});

app.get('/api/members', (req, res) => {
    const today = new Date();
    const sortedMembers = members.sort((a, b) => {
        const aNextBirthday = new Date(a.birthDate);
        aNextBirthday.setFullYear(today.getFullYear());
        if (aNextBirthday < today) aNextBirthday.setFullYear(today.getFullYear() + 1);

        const bNextBirthday = new Date(b.birthDate);
        bNextBirthday.setFullYear(today.getFullYear());
        if (bNextBirthday < today) bNextBirthday.setFullYear(today.getFullYear() + 1);

        return aNextBirthday - bNextBirthday;
    });

    res.json(sortedMembers);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});