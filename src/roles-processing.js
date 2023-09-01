var roleData = require('./data/fabled.json');
var fs = require('fs');

const processor = (roles) => {
    return roles.map((role) => ({
        id: role.id,
        name: role.name,
        team: role.team,
        firstNight: role.firstNight,
        firstNightReminder: role.firstNightReminder,
        otherNight: role.otherNight,
        otherNightReminder: role.otherNightReminder,
        reminders: [...new Set(role.reminders.concat(role.remindersGlobal))]
            .filter((role) => role)
            .map((reminder) => ({ text: reminder, count: 1 })),
        setup: role.setup,
        ability: role.ability,
        image: role.image,
        count: 1,
    }));
};

fs.writeFile(
    'src/data/fabled-new.json',
    JSON.stringify(processor(roleData)),
    (err) => {
        console.log(err);
    },
);
