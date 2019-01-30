var express = require('express');
var router = express.Router();
var loger = require('../logmodule.js');           //로그모듈
var client = require('../config/mysqlconfig.js'); //mysql 모듈
loger.info("메모리 로딩 시작. - index.js");


/* 메인화면 */
router.get('/', function (req, res, next) {
  loger.info("/ 메인화면 진입. - index.js");
  var sql = 'select * from bigTbl';
  client.query(sql, function (err, rows, results) {
    if(err){
      loger.error('대분류 조회 문장에 오류가 있습니다. - / - /index.js');
      loger.error(err);
    }else{
        if(rows.length > 0){
            res.render('index',{
              rows:rows
            });
        }else{
          //대분류 제목이 없을 경우
          var ud = undefined;
          res.render('index',{
            rows:ud
          });
        }
    }
  });
});


module.exports = router;
loger.info("메모리 로딩 완료. - index.js");









  