var express = require('express');
var router = express.Router();
var loger = require('../logmodule.js');           //로그모듈
var client = require('../config/mysqlconfig.js'); //mysql 모듈
var selectMenuQuery = require('./selectmenuquery.js');     //메뉴명 가져오는 쿼리 모듈

loger.info("메모리 로딩 시작. - index.js");


/* 메인화면 */
router.get('/', function (req, res, next) {
  loger.info("/ 메인화면 진입. - index.js");

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


module.exports = router;
loger.info("메모리 로딩 완료. - index.js");









  