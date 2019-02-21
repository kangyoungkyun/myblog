var express = require('express');
var router = express.Router();
var loger = require('../../logmodule.js');                  //로그모듈
var multer = require('multer')                              //파일관련 모듈
var client = require('../../config/mysqlconfig.js');        //mysql 모듈
var selectMenuQuery = require('../selectmenuquery.js');     //메뉴명 가져오는 쿼리 모듈
var fs = require('fs');                                     //파일 시스템 모듈
loger.info("메모리 로딩 시작. - goal.js");


/* 대분류 작성*/
router.get('/goal/goal', function (req, res, next) {
  //대분류 작성 페이지 왼쪽 메뉴명 가져옴 - 필요함!
  selectMenuQuery(function(err, menuResult) {
    if(err){
      loger.info(err);
    }else{
      if(menuResult.length == 0){
        res.render('goal/goal',{
          rows:undefined
        });
      }else{
        res.render('goal/goal',{
          rows:menuResult
        });
      }
    }
  });
});


module.exports = router;
loger.info("메모리 로딩 완료. - goal.js");


