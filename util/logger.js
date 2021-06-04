function errLog(data) {
  console.log(Date.now(), ': Failed', data);
}

function succLog(data) {
  console.log(Date.now(), ': Success', data);
}

function dbLog(user, message) {
  console.log(Date.now(), ': DB Error', user, message);
}

module.exports = {
  errLog,
  succLog,
  dbLog,
}