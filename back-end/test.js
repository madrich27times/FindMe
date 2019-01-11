var express = require("express");
var names = require("./names.json");
var rand = require("random-seed").create();

var n = rand(5000);

var app = express();

app.get("/", function(req, res) {
  res.send("test");
});

app.get("/api/results=:results", function(req, res) {
  var p = req.params;
  var obj = createPeople(p);
  res.json(obj);
  //res.send(JSON.stringify(obj));
});

app.get("/api/results=:results/seed=:key", function(req, res) {
  var p = req.params;
  //console.log(p);
  var obj = createPeople(p);
  res.json(obj);
  res.send("Results " + p.results + " seed " + p.key);
});

function test(p) {
  console.log("Results " + p.results + " seed " + p.key);
}

var isSeeded = false;

function createPeople(p) {
  var obj = {
    results: []
  };
  var obj;
  if (p.key != undefined) {
    //set seed
    isSeeded = true;
    var seed = p.key,
      rand1 = require("random-seed").create(seed),
      rand2 = require("random-seed").create(seed);
  } else {
    if (p.results < 5000) {
      obj.results = generate(p.results);
    } else {
      obj.results = generate(5000);
    }
  }
  return obj;
}

function generate(num) {
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

  for (let i = 0; i < num; i++) {
    gender = getGender();
    title = getTitle(gender);
    fName = getFirstName(gender);
    lName = getLastName(gender);
    var picArr = getPics(gender);
    mPic = picArr[0];
    lPic = picArr[1];
    email = getEmail(fName, lName);
    username = getUsername(fName, lName);
    pass = getPassword();
    phone = getPhoneNumber();
    dob = getBirthday();
    age = getAge(dob);
    street = getStreet();
    city = getCity();
    state = getState();
    postcode = getPostCode();
    //dob = getISODate(dob);
    console.log(
      `Person: ${gender}, ${title}, ${fName} ${lName} \n ${mPic}, ${lPic} \n ${email}, ${username}, ${pass}, ${phone} \n ${dob}, ${age} \n ${street}, ${city}, ${state} ${postcode}`
    );
    var person = createJSON(
      fName,
      lName,
      gender,
      title,
      lPic,
      mPic,
      phone,
      email,
      username,
      pass,
      dob,
      age,
      street,
      city,
      state,
      postcode
    );
    people.push(person);
  }
  return people;
}

function createJSON(
  fname,
  lname,
  gender,
  title,
  lpic,
  mpic,
  phone,
  email,
  username,
  pass,
  dob,
  age,
  street,
  city,
  state,
  postcode
) {
  var person = {
    gender: gender,
    name: {
      first: fname[0].toString(),
      last: lname[0].toString(),
      title: title
    },
    location: {
      street: street,
      city: city,
      state: state[0].toString(),
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
      large: lpic,
      medium: mpic
    }
  };
  //return JSON.stringify(person);
  return person;
}

function getGender() {
  if (!isSeeded) {
    var index = Math.floor(Math.random() * 2);
    return names.genders[index];
  }
}

function getTitle(gender) {
  if (!isSeeded) {
    var index = Math.floor(Math.random() * 2);
    if (gender == "male") {
      return "mr";
    } else {
      return names.titles[index];
    }
  }
}

var B = 10;
var N = 0;

function getFirstName(gender) {
  var name;
  if (!isSeeded) {
    if (gender == "male") {
      var male_arr = names.male_names;
      var num = Math.floor(Math.random() * male_arr.length - N);
      N = Math.min(N + 1, B);
      name = male_arr.splice(num, 1);
      male_arr.push(name);
    } else {
      var female_arr = names.female_names;
      var num = Math.floor(Math.random() * female_arr.length - N);
      N = Math.min(N + 1, B);
      name = female_arr.splice(num, 1);
      female_arr.push(name);
    }
  }
  return name;
}

function getLastName() {
  var name;
  if (!isSeeded) {
    var lname_arr = names.last_names;
    var num = Math.floor(Math.random() * lname_arr.length - N);
    N = Math.min(N + 1, B);
    var name = lname_arr.splice(num, 1);
    lname_arr.push(name);
  }
  return name;
}

function getPics(gender) {
  var pics = [];
  if (!isSeeded) {
    var index = Math.floor(Math.random() * 41);
    if (gender == "male") {
      if (index < 10) {
        index = "00" + index;
      } else {
        index = "0" + index;
      }
      pics.push("localhost:3000/images/large/men/m" + index + ".jpg");
      pics.push("localhost:3000/images/med/men/m" + index + ".jpg");
    } else {
      if (index < 10) {
        index = "00" + index;
      } else {
        index = "0" + index;
      }
      pics.push("localhost:3000/images/large/women/f" + index + ".jpg");
      pics.push("localhost:3000/images/med/women/f" + index + ".jpg");
    }
  }
  return pics;
}

var emailSect = 10;
var emailStart = 0;
function getEmail(fname, lname) {
  var email;
  if (!isSeeded) {
    var arr1 = names.username_a;
    var arr2 = names.username_b;
    var num = Math.floor(Math.random() * arr1.length - emailStart);
    emailStart = Math.min(emailStart + 1, emailSect);
    var name = arr1.splice(num, 1);
    arr1.push(name);
    if (num % 2 == 0) {
      email =
        fname.toString().toLowerCase() +
        "_" +
        lname.toString().toLowerCase() +
        "@findme.com";
    } else {
      var num2 = Math.floor(Math.random() * arr2.length - emailStart);
      emailStart = Math.min(emailStart + 1, emailSect);
      var pre = arr2.splice(num2, 1);
      arr2.push(pre);
      if (num % 2 == 0) {
        email = pre + "_" + fname.toString().toLowerCase() + (num * 10 + 17) + "@findme.com";
      } else {
        email =
          pre +
          "_" +
          lname.toString().toLowerCase() +
          (num * 10 + 23) +
          "@findme.com";
      }
    }
  }
  return email;
}

var userSect = 10; //B
var userStart = 0; //N
function getUsername(fname, lname) {
  var uname;
  if (!isSeeded) {
    var arr1 = names.username_a;
    var arr2 = names.username_b;
    var num = Math.floor(Math.random() * arr1.length - userStart);
    userStart = Math.min(userStart + 1, userSect);
    var name = arr1.splice(num, 1);
    arr1.push(name);
    if (num % 2 == 0) {
      uname = fname.toString().toLowerCase() + "_" + name + (num * 10);
      console.log("username even", uname);
    } else {
      var num2 = Math.floor(Math.random() * arr2.length - userStart);
      userStart = Math.min(userStart + 1, userSect);
      var pre = arr2.splice(num2, 1);
      arr2.push(pre);
      if (num % 2 == 0) {
        uname = lname.toString().toLowerCase() + "_" + pre + (num * 10 + 11);
        console.log("username arr2", uname);
      } else {
        uname = pre + "_" + fname.toString().toLowerCase() + (num * 2 + 27);
        console.log("username", uname);
      }
    }
  }
  return uname;
}

var passSect = 15; //B
var passStart = 0; //N
function getPassword() {
  var pass;
  if (!isSeeded) {
    var arr1 = names.username_a;
    var arr2 = names.username_b;
    var num = Math.floor(Math.random() * arr1.length - passStart);
    passStart = Math.min(passStart + 1, passSect);
    var name = arr1.splice(num, 1);
    arr1.push(name);
    if (num % 2 == 0) {
      pass = name + (num * 8 + 5);
      console.log("pass even", pass, "num", num, "index", name);
    } else {
      var num2 = Math.floor(Math.random() * arr2.length - passStart);
      passStart = Math.min(passStart + 1, passSect);
      var pre = arr2.splice(num2, 1);
      arr2.push(pre);
      if (num % 2 == 0) {
        pass = pre + (num * 2 + 3);
        console.log("pass arr1", pass, "num", num, "index", pre);
      } else {
        pass = pre + (num * 10 + 7);
        console.log("pass", pass);
      }
    }
  }
  return pass;
}

var H = 0;
var G = 20;
function getPhoneNumber() {
  var phone;
  if (!isSeeded) {
    var area_code = names.area_codes;
    var num = Math.floor(Math.random() * area_code.length - H);
    H = Math.min(H + 1, G);
    var code = area_code.splice(num, 1);
    area_code.push(code);

    var num1 = Math.floor(Math.random() * (999 - 2) + 2);
    var num2 = Math.floor(Math.random() * (9999 - 2) + 2);
    // phone = "(" + code + ")" + " " + num1 + "-" + num2;
    phone = code + num1 + num2;
  }
  return phone;
}

function getBirthday() {
  var rand;
  var start = new Date(1960, 1, 1);
  var end = new Date(1993, 12, 31);
  if (!isSeeded) {
    rand = Math.random();
  }
  return new Date(start.getTime() + rand * (end.getTime() - start.getTime()));
}

function getAge(dob) {
  var age;
  var today = new Date();
  if (!isSeeded) {
    age = today.getFullYear() - dob.getFullYear();
  }
  return age;
}

var X = 5;
var M = 0;
var Y = 3;
var D = 0;

function getStreet() {
  var street;
  if (!isSeeded) {
    var choice = Math.floor(Math.random() * 5);
    var street_a = names.last_names;
    var street_b = names.username_a;
    var streetNum = Math.floor(Math.random() * (9999 - 1) + 1);
    var end_arr = names.street_types;
    var streetName2 = " ";

    if (choice % 2 == 0) {
      var num = Math.floor(Math.random() * street_b.length - M);
      M = Math.min(M + 1, X);
      streetName2 = street_b.splice(num, 1);
      street_b.push(streetName);
    }

    var num = Math.floor(Math.random() * street_a.length - M);
    M = Math.min(M + 1, X);
    var streetName = street_a.splice(num, 1);
    street_a.push(streetName);

    var index = Math.floor(Math.random() * end_arr.length - Y);
    D = Math.min(D + 1, Y);
    var streetEnding = end_arr.splice(index, 1);
    end_arr.push(streetEnding);

    if (streetName2 != " ") {
      street =
        streetNum + " " + streetName + " " + streetName2 + " " + streetEnding;
    }
    street = streetNum + " " + streetName + " " + streetEnding;
  }
  return street;
}

function getCity() {
  var city;
  if (!isSeeded) {
    var name_arr = names.last_names;
    var endings = names.city_endings;
    var num = Math.floor(Math.random() * name_arr.length - N);
    N = Math.min(N + 1, B);
    var name = name_arr.splice(num, 1);
    name_arr.push(name);

    var index = Math.floor(Math.random() * endings.length - N);
    N = Math.min(N + 1, B);
    var end = endings.splice(index, 1);
    endings.push(end);

    if (end.toString()[0] != " ") {
      city = name + " " + end;
    } else {
      city = name + end;
    }
  }
  return city;
}

function getState() {
  var state;
  if (!isSeeded) {
    var arr = names.states;
    var num = Math.floor(Math.random() * arr.length - N);
    N = Math.min(N + 1, B);
    state = arr.splice(num, 1);
    arr.push(state);
  }
  return state;
}

function getPostCode() {
  var postcode;
  if (!isSeeded) {
    var num1 = Math.floor(Math.random() * (10 - 2) + 2);
    var num2 = Math.floor(Math.random() * (10 - 1) + 1);
    var num3 = Math.floor(Math.random() * (10 - 1) + 1);
    var num4 = Math.floor(Math.random() * (10 - 1) + 1);
    var num5 = Math.floor(Math.random() * (10 - 1) + 1);
    postcode =
      num1.toString() +
      num2.toString() +
      num3.toString() +
      num4.toString() +
      num5.toString();
  }
  return postcode;
}

function getISODate(dob) {
  var dateStr = dob.toISOString();
  var t = dateStr.split("T");
  var t2 = t[1].split("Z");
  var t3 = t2[0].split(".");
  var time = t3[0];
  var date = new Date(dateStr);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var dt = date.getDate();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }

  //console.log(year + "-" + month + "-" + dt + " " + time);
  return year + "-" + month + "-" + dt + " " + time;
}

app.listen(3000);
