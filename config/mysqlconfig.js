


//mysql 모듈
var mysql = require('mysql');


//app.js 포트 번호 80 변경하기
//mysql myblog 커넥터
// var client = mysql.createConnection({
//   host: "115.71.239.175",
//   user:'abcnt',
//   password:'1111',
//   database:'mydb2',
//   dateStrings: 'date'
// });



//app.js 포트 번호 3000번 변경하기

//mysql 로컬 커넥터
var client = mysql.createConnection({
  host: "localhost",
  user:'root',
  password:'eorn1145',
  database:'mydb2',
  dateStrings: 'date'
});




//mysql 주보 사랑 커넥터
// var client = mysql.createConnection({
//   host: "115.71.239.29",
//   user:'kk12111',
//   password:'1111',
//   database:'mydb',
//   dateStrings: 'date'
// });


module.exports = client;


/*
115.71.239.29

-- 사용자 계정 생성
 create user ‘kk12111'@115.71.239.29 identified by ‘1111’;
 
 -- 로컬 접속계정 생성
 create user kk12111@localhost identified by 1111;
 
 -- 모든 IP로 접속가능한 계정 생성
 create user kk12111@‘%’ identified by 1111;




개발
localhost
root
eorn1145

*/