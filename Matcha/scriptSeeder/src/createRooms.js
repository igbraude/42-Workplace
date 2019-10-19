const uuidv4 = require('uuid/v4');
const fs = require('fs');

fs.readFile('./data/matchList.json', 'utf8', (err, users) => {
  if (err) {
    console.log("Error reading file from disk:", err);
    return
  }
  try {
    let query = "INSERT INTO rooms(room_id, first_user, second_user) VALUES ";
    const matchList = JSON.parse(users);
    // let matchList = []

    // // GET MATCH
    // file.map(like => {
    //   file.map(like2 => {
    //     if (like[0] === like2[1] && like[1] === like2[0]) {
    //       matchList = [...matchList, {firstUser: like[0], secondUser: like[1]}]
    //     }
    //   })
    // })

    // ERASE TWINS
    for (let i = 0; i < matchList.length; i++) {
      for (let j = i + 1; j < matchList.length; j++) {
        if (matchList[i].firstUser === matchList[j].secondUser && matchList[i].secondUser === matchList[j].firstUser) {
          matchList.splice(j, 1);
        }
      }
    }

    // CREATE NEW EPUR FILE
    matchList.map(match =>
      query = query + createElem(match)
    );
    query = query.slice(0, -1);

    fs.writeFile('./data/rooms.sql', query, function (err) {
      if (err)
        return console.log(err);
      console.log('Seed has been watered correctly');
    });

  } catch (err) {
    console.log('Error parsing JSON string:', err)
  }
});

function createElem(match) {
  return "('"
    + uuidv4() +
    "', '" + match.firstUser +
    "', '" + match.secondUser +
    "'),";
}