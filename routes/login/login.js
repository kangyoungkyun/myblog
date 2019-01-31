var express = require('express');
var router = express.Router();
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



module.exports = router;
loger.info("메모리 로딩 완료. - login.js");

