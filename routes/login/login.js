var express = require('express');
var router = express.Router();
var crypto = require('crypto');      
var loger = require('../../logmodule.js');                   //로그모듈
var client = require('../../config/mysqlconfig.js');         //mysql 모듈
var selectMenuQuery = require('../selectmenuquery.js');      //메뉴명 가져오는 쿼리 모듈
loger.info("메모리 로딩 시작. - login.js");


/* 로그인 화면 보기 */
router.get('/login/login', function (req, res, next) {
  //대분류 메뉴명 가져옴
  selectMenuQuery(function(err, menuResult) {
    if(err){
      loger.info(err);
    }else{
      if(menuResult.length == 0){
        res.render('login/login',{
          rows:undefined
        });
      }else{
        res.render('login/login',{
          rows:menuResult
        });
      }
    }
  });
});

/* 가입화면 보기 */
router.get('/login/usersign', function (req, res, next) {
    //대분류 메뉴명 가져옴
    selectMenuQuery(function(err, menuResult) {
      if(err){
        loger.info(err);
      }else{
        if(menuResult.length == 0){
          res.render('login/usersign',{
            rows:undefined
          });
        }else{
          res.render('login/usersign',{
            rows:menuResult
          });
        }
      }
    });
  });

/* 비번찾기 화면 보기 */
router.get('/login/idpwfind', function (req, res, next) {
    //대분류 메뉴명 가져옴
    selectMenuQuery(function(err, menuResult) {
      if(err){
        loger.info(err);
      }else{
        if(menuResult.length == 0){
          res.render('login/idpwfind',{
            rows:undefined
          });
        }else{
          res.render('login/idpwfind',{
            rows:menuResult
          });
        }
      }
    });
  });



/* 유저 신청 가입 post action */
router.post('/login/usersignup', function (req, res, next) {

  var nickname = req.body.nickname;
  var email = req.body.email;
  var pwd = req.body.pwd;

  //이미 존재하는 닉네임인지 확인
  client.query('SELECT ?? FROM ?? WHERE ?? = ?',
    ['id', 'userTbl', 'nickname', nickname], function (err, rows, results) {

      if (err) {
        loger.error('가입할때 닉네임 중복체크 쿼리 문장에 오류가 있습니다. - login.js - /login/usersignup');
        loger.error(err);
      } else {
        if (rows.length > 0) {
          //이미 존재하는 닉네임 입니다.
          res.send({ result: 'nicknamefail', tocken: '이미 존재하는 닉네임 입니다.' });
        } else {
          //이미 존재하는 이메일인지 확인하는 쿼리!!!  
          client.query('SELECT ?? FROM ?? WHERE ?? = ?',
            ['nickname', 'userTbl', 'id', email], function (err, rows2, results) {

              if (err) {
                loger.error('가입할때 이메일 중복체크 쿼리 문장에 오류가 있습니다. - login.js - /login/usersignup');
                loger.error(err);

              } else {
                if (rows2.length > 0) {
                  //이미 존재하는 이메일 입니다.
                  res.send({ result: 'emailfail', tocken: '이미 존재하는 이메일 입니다.' });
                } else {

                  //가입할때
                  crypto.randomBytes(64, function (err, buf) {
                    crypto.pbkdf2(pwd, buf.toString('base64'), 106636, 64, 'sha512', (err, key) => {
                      //암호화된 비밀번호
                      var pwdhashkey = key.toString('base64');
                      //salt 같이 db저장
                      var salt = buf.toString('base64')

                      //mysql db에 유저 정보 넣어주기
                      client.query('insert into userTbl (nickname, id, pw, stop, stopdate ,salt) values (?,?,?,?,?,?)',
                        [nickname, email, pwdhashkey, 'n', 'n', salt],
                        function (error, result, fields) {
                          if (error) {
                            loger.error('유저 가입시 정보 삽입 쿼리 문장에 오류가 있습니다. - login.js - /login/usersignup');
                            loger.error(error);
                          } else {

                            //사용자 nickname을 세션 데이터로 저장
                            req.session.authId = email;
                            req.session.nickname = nickname;
                            req.session.save(function () {
                              res.send({ result: 'success', tocken: '가입을 축하합니다.' });
                            });
                          }
                        });
                    });
                  });
                }
              }
            });
        }
      }
    });
});


/* 로그인 post action. */
router.post('/login/loginup', function (req, res, next) {

  var email = req.body.email;
  var pwd = req.body.pwd;

  client.query('SELECT ??, ??, ??,?? FROM ?? WHERE ?? = ?',
    ['id','nickname', 'pw', 'salt', 'userTbl', 'id', email], function (err, rows, results) {

      if (err) {
        loger.error('로그인 쿼리 문장에 오류가 있습니다. - login.js - /login/loginup');
        loger.error(err);
      } else {
        if (rows.length > 0) {
          //아이디가 존재할 경우
          crypto.pbkdf2(pwd, rows[0].salt, 106636, 64, 'sha512', function (err, key) {
            if (key.toString('base64') === rows[0].pw) {

              req.session.authId = rows[0].id;
              req.session.nickname = rows[0].nickname;
              req.session.save(function () {
                res.send({ result: 'success', tocken: '로그인 성공' });
              });

            } else {
              //비밀번호가 틀릴경우
              res.send({ result: 'pwfail', tocken: '비밀번호를 확인해주세요.' });
              
            }
          });
        } else {
          //아이디가 존재하지 않을경우
          res.send({ result: 'idfail', tocken: '존재하지 않는 아이디입니다.' });
          
        }
      }
    });
});


/* 로그아웃  page. */
router.get('/login/logout', function (req, res, next) {
  req.session.destroy(function () {
    res.locals.whoami = undefined;
    res.locals.email = undefined;
    selectMenuQuery(function(err, menuResult) {
      if(err){
        loger.info(err);
      }else{
        if(menuResult.length == 0){
            //대분류 제목이 없을 경우
            var ud = undefined;
            res.render('index',{
              rows:ud
            });
        }else{
          res.render('index',{
            rows:menuResult
          });
        }
      }
    });
  });
});





module.exports = router;
loger.info("메모리 로딩 완료. - login.js");

