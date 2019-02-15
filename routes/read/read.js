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
            //중분류 글 조회
            var sql3 = 'select * from middleTbl where bignum = ?';
            client.query(sql3, [bignum], function (err3, middlerows, results) {
              if (err3) {
                loger.error('중분류 글 조회 문장에 오류가 있습니다. - /read/readbigmiddle - /read.js');
                loger.error(err3);
              } else { 
                //중분류 글 존재.
                if(middlerows.length > 0){
                  
                  //소분류 글 조회
                  var sql4 = 'select * from postTbl where middlenum in ' +
                            '(select m.middlenum from bigTbl b, middleTbl m where b.bignum = m.bignum ' +
                            'and b.bignum = ?)';
                  client.query(sql4, [bignum], function (err4, postrows, results) {
                    if (err4) {
                      loger.error('소분류 글 조회 문장에 오류가 있습니다. - /read/readbigmiddle - /read.js');
                      loger.error(err4);
                    } else {

                      //소분류 글 존재할때
                      if (postrows.length > 0) {
                        res.render('read/readbigmiddle', {
                          rows: menuResult,
                          onerow: onerow,
                          middlerows: middlerows,
                          postrows: postrows
                        });

                        //소분류 글 존재 (x)   
                      } else {
                        res.render('read/readbigmiddle', {
                          rows: menuResult,
                          onerow: onerow,
                          middlerows: middlerows,
                          postrows: undefined
                        });
                      }
                    }
                  });

                } else {
                  res.render('read/readbigmiddle', {
                    rows: menuResult,
                    onerow: onerow,
                    middlerows: undefined,
                    postrows: undefined
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


/* 영상 포스트 보기 */
router.get('/read/readpost', function (req, res, next) {

  var postnum = req.query.postnum;       //post pk 값
  var bignum = req.query.bignum;       //post pk 값
  //대분류 메뉴명 가져옴
  selectMenuQuery(function (err, menuResult) {
    if (err) {
      loger.info(err);
    } else {
      if (menuResult.length == 0) {
        res.render('read/readpost', {
          rows: undefined
        });
      } else {

        //소분류 글 조회
        var sql = 'select * from postTbl where postnum = ?';
        client.query(sql, [postnum], function (err, postonerow, results) {
          if (err) {
            loger.error('소분류 글 조회 문장에 오류가 있습니다. - /read/readpost - /read.js');
            loger.error(err);
          } else {

            //포스트 글 존재.
            if (postonerow.length > 0) {

              //중분류 + 소분류 글 전체 조회
              var sql4 =  'select * from postTbl p, middleTbl m where p.middlenum = m.middlenum ' +
                          'and m.middlenum in ' +
                          '(select m.middlenum from bigTbl b, middleTbl m ' +
                          'where b.bignum = m.bignum and b.bignum = ?)';

              client.query(sql4, [bignum], function (err4, postrows, results) {
                if (err4) {
                  loger.error('소분류 글 조회 문장에 오류가 있습니다. - /read/readbigmiddle - /read.js');
                  loger.error(err4);
                } else {

                  //소분류 글 존재할때
                  if (postrows.length > 0) {
                    res.render('read/readpost', {
                      rows: menuResult,
                      postonerow: postonerow,
                      postrows:postrows
                    });

                    //소분류 글 존재 (x)   
                  } else {
                    res.render('read/readpost', {
                      rows: menuResult,
                      postonerow: undefined,
                      postrows:undefined
                    });
                  }
                }
              });

            } else {
              res.render('read/readpost', {
                rows: menuResult,
                postonerow: undefined
              });
            }
          }
        });
      }
    }
  });
});



/* 마이 포스트 글 중분류 보기 */
router.get('/read/readbigmiddlegul', function (req, res, next) {

  var bignum = req.query.num;       //대분류 pk 값

  loger.info(bignum);

  var sql2 = 'select * from bigTbl where bignum = ?';
  client.query(sql2, [bignum], function (err2, onerow, results) {
    if (err2) {
      loger.error('대분류 글 하나 조회 문장에 오류가 있습니다. - /read/readbigmiddlegul - /read.js');
      loger.error(err2);
    } else {
      //대분류 메뉴명 가져옴
      selectMenuQuery(function (err, menuResult) {
        if (err) {
          loger.info(err);
        } else {
          if (menuResult.length == 0) {
            res.render('read/readbigmiddlegul', {
              rows: undefined,
              onerow: onerow
            });
          } else {
            //중분류 글 조회
            var sql3 = 'select * from middleTbl where bignum = ?';
            client.query(sql3, [bignum], function (err3, middlerows, results) {
              if (err3) {
                loger.error('중분류 글 조회 문장에 오류가 있습니다. - /read/readbigmiddlegul - /read.js');
                loger.error(err3);
              } else { 
                //중분류 글 존재.
                if(middlerows.length > 0){
                  
                  //소분류 글 조회
                  var sql4 = 'select * from postTbl where middlenum in ' +
                            '(select m.middlenum from bigTbl b, middleTbl m where b.bignum = m.bignum ' +
                            'and b.bignum = ?) ORDER BY postnum DESC';
                  client.query(sql4, [bignum], function (err4, postrows, results) {
                    if (err4) {
                      loger.error('소분류 글 조회 문장에 오류가 있습니다. - /read/readbigmiddlegul - /read.js');
                      loger.error(err4);
                    } else {

                      //소분류 글 존재할때
                      if (postrows.length > 0) {
                        res.render('read/readbigmiddlegul', {
                          rows: menuResult,
                          onerow: onerow,
                          middlerows: middlerows,
                          postrows: postrows
                        });

                        //소분류 글 존재 (x)   
                      } else {
                        res.render('read/readbigmiddlegul', {
                          rows: menuResult,
                          onerow: onerow,
                          middlerows: middlerows,
                          postrows: undefined
                        });
                      }
                    }
                  });

                } else {
                  res.render('read/readbigmiddlegul', {
                    rows: menuResult,
                    onerow: onerow,
                    middlerows: undefined,
                    postrows: undefined
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





/* 대분류 수정 */
router.get('/read/bigmodify', function (req, res, next) {
  //대분류 메뉴명 가져옴
  selectMenuQuery(function (err, menuResult) {
    if (err) {
      loger.info(err);
    } else {

      if (menuResult.length == 0) {
        res.render('read/bigmodify', {
          rows: undefined
        });
      } else {
        res.render('read/bigmodify', {
          rows: menuResult
        });
      }

    }
  });
});


/* 글 포스트 보기 */
router.get('/read/readpostgul', function (req, res, next) {

  var postnum = req.query.postnum;       //post pk 값
  var bignum = req.query.bignum;       //post pk 값
  //대분류 메뉴명 가져옴
  selectMenuQuery(function (err, menuResult) {
    if (err) {
      loger.info(err);
    } else {
      if (menuResult.length == 0) {
        res.render('read/readpostgul', {
          rows: undefined
        });
      } else {

        //포스트 글 조회
        var sql = 'select * from postTbl where postnum = ?';
        client.query(sql, [postnum], function (err, postonerow, results) {
          if (err) {
            loger.error('내포스트 글 조회 문장에 오류가 있습니다. - /read/readpostgul - /read.js');
            loger.error(err);
          } else {

            //포스트 글 존재.
            if (postonerow.length > 0) {
              
              var newcnt = Number(postonerow[0]['cnt']) + 1;

              //조회수 조회해서 +1 한 후 업데이트!
              var cntupatesql = 'update postTbl set cnt= ' + newcnt + ' where postnum= ?';
              client.query(cntupatesql, [postnum], function (err5, postrows, results) {
                if (err5) {
                  loger.error('내포스트 조회수 업데이트 문장에 오류가 있습니다. - /read/readpostgul - /read.js');
                  loger.error(err5);
                } else {

              //조회수 업데이트 성공!

              //중분류 + 소분류 글 전체 조회
              var sql4 =  'select * from postTbl p, middleTbl m where p.middlenum = m.middlenum ' +
                          'and m.middlenum in ' +
                          '(select m.middlenum from bigTbl b, middleTbl m ' +
                          'where b.bignum = m.bignum and b.bignum = ?)';

                  client.query(sql4, [bignum], function (err4, postrows, results) {
                    if (err4) {
                      loger.error('내포스트 글 조회 문장에 오류가 있습니다. - /read/readpostgul - /read.js');
                      loger.error(err4);
                    } else {

                      //소분류 글 존재할때
                      if (postrows.length > 0) {
                        loger.info("포스트 글 존재!");
                        res.render('read/readpostgul', {
                          rows: menuResult,
                          postonerow: postonerow,
                          postrows: postrows
                        });

                        //소분류 글 존재 (x)   
                      } else {
                        loger.info("포스트 글 존재 안함!");
                        res.render('read/readpostgul', {
                          rows: menuResult,
                          postonerow: undefined,
                          postrows: undefined
                        });
                      }
                    }
                  });
                }
              });

            } else {
              res.render('read/readpostgul', {
                rows: menuResult,
                postonerow: undefined
              });
            }


          }
        });
      }
    }
  });
});

module.exports = router;
loger.info("메모리 로딩 완료. - read.js");

