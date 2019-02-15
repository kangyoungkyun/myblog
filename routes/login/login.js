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








module.exports = router;
loger.info("메모리 로딩 완료. - login.js");

