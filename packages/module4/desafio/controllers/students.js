const fs = require('fs');
const data = require('../db.json');
const { age, date, grade } = require('../utils');

exports.index = (req, res) => {
  const students = [];

  data.students.map((student) => {
    student.grade = grade(student.grade);
    students.push(student);
  });

  return res.render('students/index', { students });
};

exports.create = (req, res) => {
  return res.render('students/create');
};

exports.post = (req, res) => {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == '') return res.send('Please fill all fields');
  }

  let id = 1;
  const lastStudent = data.students[data.students.length - 1];

  if (lastStudent) {
    id = lastStudent.id + 1;
  }

  data.students.push({
    id,
    ...req.body,
    birth: Date.parse(req.body.birth),
  });

  fs.writeFile('db.json', JSON.stringify(data, null, 2), (error) => {
    if (error) return res.send('Error in write file');

    return res.redirect(`/students/${id}`);
  });
};

exports.show = (req, res) => {
  const { id } = req.params;

  const foundStudent = data.students.find((student) => {
    return student.id == id;
  });

  if (!foundStudent) return res.send('Student not found');

  const student = {
    ...foundStudent,
    grade: grade(foundStudent.grade),
    age: age(foundStudent.birth),
  };

  console.log(student);

  return res.render('students/show', { student });
};

exports.edit = (req, res) => {
  const { id } = req.params;

  const foundStudent = data.students.find((student) => {
    return student.id == id;
  });

  if (!foundStudent) return res.send('student not found');

  const student = {
    ...foundStudent,
    birth: date(foundStudent.birth).iso,
  };

  return res.render('students/edit', { student });
};

exports.put = (req, res) => {
  const { id } = req.body;

  let index = 0;

  const foundStudent = data.students.find((student, foundIndex) => {
    if (id == student.id) {
      index = foundIndex;
      return true;
    }
  });

  if (!foundStudent) return res.send('student not found');

  const student = {
    ...foundStudent,
    ...req.body,
    birth: Date.parse(req.body.birth),
  };

  data.students[index] = student;

  fs.writeFile('db.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('Write error !');

    return res.redirect(`/students/${id}`);
  });
};

exports.delete = (req, res) => {
  const { id } = req.body;

  const remainingstudents = data.students.filter((student) => {
    return student.id != id;
  });

  data.students = remainingstudents;

  fs.writeFile('db.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.json('Write error !');

    return res.redirect('/students');
  });
};
