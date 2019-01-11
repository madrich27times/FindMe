var names = require("../names.json");
var gen = require("random-seed");

exports.index = function (req, res) {
  var p = req.params;
  var obj = createPeople(p);
  res.set('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.set('Access-Control-Allow-Headers', 'http://localhost:8080');
  res.json(obj);
};

function createPeople(p) {
  var obj = {
    results: []
  };
  var rand;
  if (p.key != undefined) {
    gen.create().initState();
    rand = gen.create(p.key);
    //rand.initState();
  } else {
    rand = gen.create();
  }
  obj.results = generate(rand, p.results);
  return obj;
}

function generate(rand, num) {
  var people = [];
  var fName;
  var lName;
  var gender;
  var title;
  var lPic;
  var mPic;
  var phone;
  var email;
  var username;
  var pass;
  var dob;
  var age;
  var street;
  var city;
  var state;
  var postcode;

  if (num > 5000) {
    num == 5000;
  }

  for (let i = 0; i < num; i++) {
    gender = names.genders[rand(names.genders.length)];
    var index = rand.intBetween(1, 39);
    var imgIndex;
    if (index < 10) {
      imgIndex = "00" + index.toString();
    } else {
      imgIndex = "0" + index.toString();
    }
    if (gender == "male") {
      title = "mr";
      fName = names.male_names[rand(names.male_names.length)];
      lPic = "http://localhost:3000/public/images/large/men/m" + imgIndex + ".jpg";
      mPic = "http://localhost:3000/public/images/med/men/m" + imgIndex + ".jpg";
    } else {
      title = names.titles[rand(names.titles.length)];
      fName = names.female_names[rand(names.female_names.length)];
      lPic = "http://localhost:3000/public/images/large/women/f" + imgIndex + ".jpg";
      mPic = "http://localhost:3000/public/images/med/women/f" + imgIndex + ".jpg";
    }
    lName = names.last_names[rand(names.last_names.length)];
    fName = fName.toString().toLowerCase();
    lName = lName.toString().toLowerCase();

    if (index % 2 == 0) {
      email = fName + "_" + lName + ((index * 13) + 8) + "@findme.com";
      username = fName + "_" + names.username_b[rand(names.username_b.length)];
      pass = names.username_a[rand(names.username_a.length)] + ((index * 2) + 20);
      street =
        rand.intBetween(1, 9999).toString() + " " +
        names.last_names[rand(names.last_names.length)] +
        " " +
        names.street_types[rand(names.street_types.length)];
    } else {
      email =
        names.username_a[rand(names.username_a.length)] +
        "_" +
        (index * 3 + 7) +
        "@findme.com";
      username = names.username_b[rand(names.username_b.length)]; +
      "_" + lName + ((index * 8) + 5);
      pass = names.username_b[rand(names.username_b.length)] + ((index * 2) + 20);

      street =
        rand.intBetween(1, 9999).toString() + " " +
        names.male_names[rand(names.male_names.length)] +
        " " +
        names.street_types[rand(names.street_types.length)];
    }

    phone =
      "(" + names.area_codes[rand(names.area_codes.length)] + ")-" +
      rand.intBetween(2, 999).toString() + "-" +
      rand.intBetween(2, 9999).toString();
    var start = new Date(1960, 1, 1);
    var end = new Date(1993, 12, 31);
    dob = new Date(
      start.getTime() + rand.random() * (end.getTime() - start.getTime())
    );
    var today = new Date();
    age = today.getFullYear() - dob.getFullYear();

    var cityName = names.last_names[rand(names.last_names.length)];
    var cityEnd = names.city_endings[rand(names.city_endings.length)];
    if (cityEnd.toString()[0] != " ") {
      city = cityName + " " + cityEnd;
    } else {
      city = cityName + cityEnd;
    }

    state = names.states[rand(names.states.length)];
    state = state.toString();
    postcode =
      rand.intBetween(2, 9).toString() +
      rand.intBetween(1, 9).toString() +
      rand.intBetween(1, 9).toString() +
      rand.intBetween(1, 9).toString() +
      rand.intBetween(1, 9).toString();

    console.log(
      `Person: ${gender}, ${title}, ${fName} ${lName} \n ${mPic}, ${lPic} \n ${email}, ${username}, ${pass}, ${phone} \n ${dob}, ${age} \n ${street}, ${city}, ${state} ${postcode}`
    );

    var person = {
      gender: gender,
      name: {
        first: fName,
        last: lName,
        title: title
      },
      location: {
        street: street,
        city: city,
        state: state,
        postcode: postcode
      },
      email: email,
      login: {
        username: username,
        password: pass
      },
      dob: {
        date: dob,
        age: age
      },
      phone: phone,
      picture: {
        large: lPic,
        medium: mPic
      }
    };
    people.push(person);
  }
  return people;
}