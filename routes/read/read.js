var express = require('express');
var router = express.Router();
var loger = require('../../logmodule.js');           //로그모듈
var client = require('../../config/mysqlconfig.js');        //mysql 모듈
loger.info("메모리 로딩 시작. - read.js");


/* 중분류 보기 */
router.get('/read/readbigmiddle', function (req, res, next) {

  var bignum = req.query.num;
  loger.info(bignum);

  var sql = 'select * from bigTbl';
  client.query(sql, function (err, rows, results) {
    if(err){
      loger.error('대분류 조회 문장에 오류가 있습니다. - /read/readbigmiddle - /read.js');
      loger.error(err);
    }else{

      if(rows.length > 0){
        var sql2 = 'select * from bigTbl where bignum = ?';
        client.query(sql2, bignum,function (err, onerow, results) {
          if(err){
            loger.error('대분류 글 하나 조회 문장에 오류가 있습니다. - /read/readbigmiddle - /read.js');
            loger.error(err);
          }else{
            res.render('read/readbigmiddle',{
              rows:rows,
              onerow:onerow
            });
          }
        })

    }else{
      //대분류 제목이 없을 경우
      var ud = undefined;
      res.render('read/readbigmiddle',{
        rows:ud,
        onerow:ud
      });
    }
    }
  });


});



/* 포스트 보기 */
router.get('/read/readpost', function (req, res, next) {
  var sql = 'select * from bigTbl';
  client.query(sql, function (err, rows, results) {
    if(err){
      loger.error('대분류 조회 문장에 오류가 있습니다. - /read/readpost - /read.js');
      loger.error(err);
    }else{
        if(rows.length > 0){
            res.render('read/readpost',{
              rows:rows
            });
        }else{
          //대분류 제목이 없을 경우
          var ud = undefined;
          res.render('read/readpost',{
            rows:ud
          });
        }
    }
  });
});



module.exports = router;
loger.info("메모리 로딩 완료. - read.js");


