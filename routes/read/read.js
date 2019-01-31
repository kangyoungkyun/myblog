var express = require('express');
var router = express.Router();
var loger = require('../../logmodule.js');                   //로그모듈
var client = require('../../config/mysqlconfig.js');         //mysql 모듈
var selectMenuQuery = require('../selectmenuquery.js');      //메뉴명 가져오는 쿼리 모듈
loger.info("메모리 로딩 시작. - read.js");


/* 중분류 보기 */
router.get('/read/readbigmiddle', function (req, res, next) {

  var bignum = req.query.num;       //대분류 pk 값

  loger.info(bignum);
  var sql2 = 'select * from bigTbl where bignum = ?';
  client.query(sql2, [bignum], function (err2, onerow, results) {
    if (err2) {
      loger.error('대분류 글 하나 조회 문장에 오류가 있습니다. - /read/readbigmiddle - /read.js');
      loger.error(err2);
    } else {
      //대분류 메뉴명 가져옴
      selectMenuQuery(function (err, menuResult) {
        if (err) {
          loger.info(err);
        } else {
          if (menuResult.length == 0) {
            res.render('read/readbigmiddle', {
              rows: undefined,
              onerow: onerow
            });
          } else {

            var sql3 = 'select * from middleTbl where bignum = ?';
            client.query(sql3, [bignum], function (err3, middlerows, results) {
              if (err3) {
                loger.error('중분류 글 조회 문장에 오류가 있습니다. - /read/readbigmiddle - /read.js');
                loger.error(err3);
              } else { 
                //중분류 글 존재.
                if(middlerows.length > 0){
                  res.render('read/readbigmiddle', {
                    rows: menuResult,
                    onerow: onerow,
                    middlerows:middlerows
                  });
                }else{
                  res.render('read/readbigmiddle', {
                    rows: menuResult,
                    onerow: onerow,
                    middlerows:undefined
                  });
                }
              }
            });
          }
        }
      });
    }
  });
});


/* 포스트 보기 */
router.get('/read/readpost', function (req, res, next) {
  //대분류 메뉴명 가져옴
  selectMenuQuery(function(err, menuResult) {
    if(err){
      loger.info(err);
    }else{
      if(menuResult.length == 0){
        res.render('read/readpost',{
          rows:undefined
        });
      }else{
        res.render('read/readpost',{
          rows:menuResult
        });
      }
    }
  });
});



module.exports = router;
loger.info("메모리 로딩 완료. - read.js");


