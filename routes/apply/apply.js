var express = require('express');
var router = express.Router();
var loger = require('../../logmodule.js');           //로그모듈
var client = require('../../config/mysqlconfig.js');        //mysql 모듈
loger.info("메모리 로딩 시작. - read.js");


/* 메뉴명 가져오는 쿼리  */
function selectMenuQuery( callback ) {
  var sql = 'select * from bigTbl';
  client.query(sql, function(err, rows, results) {
      if (err) {
           callback(err);
           return;
      }else{
        callback(null, rows); 
      }
  });
};



/* 상품 신청 화면 */
router.get('/apply/apply', function (req, res, next) {
  selectMenuQuery(function(err, menuResult) {
    if(err){
      loger.info(err);
    }else{
      if(menuResult.length == 0){
        res.render('apply/apply',{
          rows:undefined
        });
      }else{
        res.render('apply/apply',{
          rows:menuResult
        });
      }
    }
  });
});

/* 결제 화면 */
router.get('/apply/applypay', function (req, res, next) {
  selectMenuQuery(function(err, menuResult) {
    if(err){
      loger.info(err);
    }else{
      if(menuResult.length == 0){
        res.render('apply/applypay',{
          rows:undefined
        });
      }else{
        res.render('apply/applypay',{
          rows:menuResult
        });
      }
    }
  });
});



module.exports = router;
loger.info("메모리 로딩 완료. - read.js");


