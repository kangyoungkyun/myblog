var express = require('express');
var router = express.Router();
var loger = require('../../logmodule.js');                  //로그모듈
var multer = require('multer')                              //파일관련 모듈
var client = require('../../config/mysqlconfig.js');        //mysql 모듈
var selectMenuQuery = require('../selectmenuquery.js');     //메뉴명 가져오는 쿼리 모듈
var fs = require('fs');                                     //파일 시스템 모듈
loger.info("메모리 로딩 시작. - write.js");


/* 대분류 작성*/
router.get('/write/bigwrite', function (req, res, next) {
  //대분류 작성 페이지 왼쪽 메뉴명 가져옴 - 필요함!
  selectMenuQuery(function(err, menuResult) {
    if(err){
      loger.info(err);
    }else{
      if(menuResult.length == 0){
        res.render('write/bigwrite',{
          rows:undefined
        });
      }else{
        res.render('write/bigwrite',{
          rows:menuResult
        });
      }
    }
  });
});

/* 중분류 작성*/
router.get('/write/middlewrite', function (req, res, next) {
  //대분류 작성 페이지 왼쪽 메뉴명 가져옴 - 필요함!
  selectMenuQuery(function(err, menuResult) {
    if(err){
      loger.info(err);
    }else{
      if(menuResult.length == 0){
        res.render('write/middlewrite',{
          rows:undefined,
          selectrows: undefined
        });
      }else{

        //중분류 글쓰기에서 대분류 셀렉트 박스 선택 위한 조회 쿼리
        var sql = 'select * from bigTbl';
        client.query(sql, function (err, selectrows, results) {
          if (err) {
            loger.info(err);
            return;
          } else {

            res.render('write/middlewrite',{
              rows:menuResult,
              selectrows : selectrows
            });
          }
        }); 


      }
    }
  }); 
});

/* 소분류 작성 */
router.get('/write/write', function (req, res, next) {
  //대분류 작성 페이지 왼쪽 메뉴명 가져옴 - 필요함!
  selectMenuQuery(function(err, menuResult) {
    if(err){
      loger.info(err);
    }else{
      if(menuResult.length == 0){
        res.render('write/write',{
          rows:undefined,
          selectrows: undefined
        });
      }else{

        //영상 소분류 글쓰기에서 대분류 셀렉트 박스 선택 위한 조회 쿼리
        var sql = 'select * from bigTbl';
        client.query(sql, function (err, selectrows, results) {
          if (err) {
            loger.info(err);
            return;
          } else {
            res.render('write/write', {
              rows: menuResult,
              selectrows: selectrows
            });
          }
        }); 
      }
    }
  }); 
});


//파일 저장위치와 파일이름 설정
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //파일이 이미지 파일이면
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png") {
      cb(null, 'public/bigwriteimages');
      //텍스트 파일이면 
    } else {
      loger.info("그림파일만 등록할 수 있습니다.");
    };
  },
  //파일이름 설정
  filename: function (req, file, cb) {
    var nowdate = new Date().toLocaleString();
    var nowdate2 = nowdate.replace(' ','');
    var nowdate3 = nowdate2.replace(':','');
    var nowdate4 = nowdate3.replace('-','');
    var nowdate5 = nowdate4.replace('-','');
    var now = nowdate5.replace(':','');
    var filename = now + '.png';
    cb(null,filename);                          // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
});


//파일 업로드 모듈
var upload = multer({ storage: storage });
/* 대분류 저장 액션 */
router.post('/write/bigwritesaveimage', upload.single('fileupload') ,function (req, res, next) {
  loger.info('대분류 이미지 저장 진입  - /write/bigwritesaveimage - write.js ');
  //파일 경로 넘겨주기
  //var originalFileName = req.file.originalname;
  var nowdate = new Date().toLocaleString();
  var nowdate2 = nowdate.replace(' ','');
  var nowdate3 = nowdate2.replace(':','');
  var nowdate4 = nowdate3.replace('-','');
  var nowdate5 = nowdate4.replace('-','');
  var now = nowdate5.replace(':','');

  res.send({ result: 'success' , 'path' : './bigwriteimages/'+ now + '.png' });
});

/* 대분류 저장 액션 */
router.post('/write/bigwritesave',function (req, res, next) {
  loger.info('대분류 저장 진입  - /write/bigwritesave - write.js');
  var section = req.body.sectiontext;
  var fileurl = req.body.fileurl;
  var title = req.body.title;
  var mainclose = req.body.mainclose;
  var pay = req.body.pay;
  var close = req.body.close;
  var price = req.body.price;
  var summernoteContent = req.body.summernoteContent;
  var imagepath = req.body.imagepath;
  var lang = req.body.lang;

  var insertsql = 'insert into bigTbl (title,description,close,pay,mainclose,section,price,fileurl,image,lang) values (?,?,?,?,?,?,?,?,?,?)';
  var params = [title, summernoteContent, close, pay , mainclose, section, price,fileurl ,imagepath,lang];
  client.query(insertsql, params, function (err, rows, fields) {
    if (err) {
      loger.error('대분류 insert 쿼리에 오류가 있습니다. - /write/bigwritesave - write.js');
      loger.error(err);
    } else {
      if(rows.insertId){
        res.send({ result: 'success' , tocken:'저장성공'});
      }else{
        res.send({ result: 'fail' , tocken:'저장실패'});
      }
    }
  });
});


/* 중분류 저장 액션 */
router.post('/write/middlewritesave',function (req, res, next) {
  loger.info('중분류 저장 진입  - /write/middlewritesave - write.js');

  var bignum = req.body.bignum;                               //대분류 pk
  var middletitle = req.body.middletitle;                     //중분류 타이틀
  var close = req.body.close;                                 //비공개
  var summernoteContent = req.body.summernoteContent;         //설명

  var insertsql = 'insert into middleTbl (title,description,close,bignum) values (?,?,?,?)';
  var params = [middletitle, summernoteContent, close, bignum];
  client.query(insertsql, params, function (err, rows, fields) {
    if (err) {
      loger.error('중분류 insert 쿼리에 오류가 있습니다. - /write/middlewritesave - write.js');
      loger.error(err);
    } else {
      if(rows.insertId){
        res.send({ result: 'success' , tocken:'저장성공'});
      }else{
        res.send({ result: 'fail' , tocken:'저장실패'});
      }
    }
  });
});



/* 소분류 저장 액션 */
router.post('/write/postsave',function (req, res, next) {
  loger.info('소분류 저장 진입  - /write/postsave - write.js');

  var videourl = req.body.videourl;                               
  var videotime = req.body.videotime;                             
  var posttitle = req.body.posttitle;                            
  var cansee = req.body.cansee;                               
  var close = req.body.close;                                                  
  var middlenum = req.body.middlenum;         
  var summernoteContent = req.body.summernoteContent;         

  var insertsql = 'insert into postTbl (middlenum, title,description,close,cansee,videourl,videotime,author,cnt) values (?,?,?,?,?,?,?,?,?)';
  var params = [middlenum,posttitle,summernoteContent,close,cansee,videourl,videotime,'큔','0'];
  client.query(insertsql, params, function (err, rows, fields) {
    if (err) {
      loger.error('post insert 쿼리에 오류가 있습니다. - /write/postsave - write.js');
      loger.error(err);
    } else {
      if(rows.insertId){
        res.send({ result: 'success' , tocken:'저장성공'});
      }else{
        res.send({ result: 'fail' , tocken:'저장실패'});
      }
    }
  });
});


/* post 쓰기에서 대분류 셀렉트 박스 클릭했을때 중분류 제목 조회*/
router.post('/write/getMiddleTitle', function (req, res, next) {

  var bignum = req.body.bignum;  

  var sql = 'select * from middleTbl where bignum = ?';
  client.query(sql,bignum, function(err, rows, results) {
      if (err) {
        loger.error('중분류 제목 조회 쿼리에 오류가 있습니다. - /write/getMiddleTitle - write.js');
        loger.error(err);
        return;
      }else{
        
        if(rows.length > 0){
          res.send({ result: 'success' , tocken:'조회 성공' , data:rows});
        }else{
          res.send({ result: 'fail' , tocken:'조회 실패', data: '작성된 중분류가 없습니다.'});
        }
        
      }
  });
});



/* 나의 포스터  작성 페이지 (대분류 중분류 소분류 아님! 오직 글과 이미지!)*/
router.get('/write/writepost', function (req, res, next) {
  //대분류 작성 페이지 왼쪽 메뉴명 가져옴 - 필요함!
  selectMenuQuery(function(err, menuResult) {
    if(err){
      loger.info(err);
    }else{
      if(menuResult.length == 0){
        res.render('write/writepost',{
          rows:undefined,
          selectrows: undefined
        });
      }else{

        //글 소분류 글쓰기에서 대분류 셀렉트 박스 선택 위한 조회 쿼리
        var sql = 'select * from bigTbl';
        client.query(sql, function (err, selectrows, results) {
          if (err) {
            loger.info(err);
            return;
          } else {
            res.render('write/writepost', {
              rows: menuResult,
              selectrows: selectrows
            });
          }
        }); 

      }
    }
  }); 
});



/* 나의 포스터  이미지 저장 */
var uploadImages = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/mypostimages/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  }),
});
//사진 파일 선택하면 바로 콜
router.post('/write/writepostimagesave', uploadImages.single('file'), function (req, res, next) {
  loger.info('나의 포스터  사진 저장 진입  - /write/writepostimagesave - write.js');
  res.send({ url: "/mypostimages/" + req.file['originalname']});
});


//나의 포스터 저장 액션!
router.post('/write/writepostsave', function (req, res, next) {
  loger.info('나의 포스터 저장 진입  - /write/writepostsave - write.js');

  var posttitle = req.body.posttitle;                                                          
  var close = req.body.close;                                                  
  var middlenum = req.body.middlenum;         
  var summernoteContent = req.body.summernoteContent;      
  
  loger.info(posttitle);  //중급길 1
  loger.info(close);      //false
  loger.info(middlenum);  //1
  loger.info(summernoteContent);

  var insertsql = 'insert into postTbl (middlenum, title,description,close,cansee,videourl,videotime,author,cnt) values (?,?,?,?,?,?,?,?,?)';
  var params = [middlenum,posttitle,summernoteContent,close,"","","",'큔','0'];
  client.query(insertsql, params, function (err, rows, fields) {
    if (err) {
      loger.error('post insert 쿼리에 오류가 있습니다. - /write/writepostsave - write.js');
      loger.error(err);
    } else {
      if(rows.insertId){
        res.send({ result: 'success' , tocken:'저장성공'});
      }else{
        res.send({ result: 'fail' , tocken:'저장실패'});
      }
    }
  });

});


//나의 포스터 삭제 액션!
router.post('/write/writepostimagedelete', function (req, res, next) {
  loger.info('나의 포스터 이미지 삭제 진입  - /write/writepostimagedelete - write.js');

  var beforeSrc = req.body.src;
  var afterSrc = beforeSrc.split('/');
  var filename = afterSrc.slice(-1)[0];     //제일 마지막 배열 요소 가져오기
                                                      
  fs.unlink('./public/mypostimages/'+ filename,function (err) {
    if (err) throw err;
    console.log('successfully deleted ./public/mypostimages/'+filename);
  });


});





//대분류 글 수정
router.get('/write/bigmodiy', function (req, res, next) {

  var bignum = req.query.num;       //대분류 pk 값

  loger.info(bignum);

  var sql2 = 'select * from bigTbl where bignum = ?';
  client.query(sql2, [bignum], function (err2, onerow, results) {
    if (err2) {
      loger.error('대분류 글 하나 조회 문장에 오류가 있습니다. - /write/bigmodiy - /write.js');
      loger.error(err2);
    } else {
      //대분류 메뉴명 가져옴
      selectMenuQuery(function (err, menuResult) {
        if (err) {
          loger.info(err);
        } else {
          if (menuResult.length == 0) {
            res.render('write/bigmodiy', {
              rows: undefined,
              onerow: onerow
            });
          } else {

            //수정할 대분류 글과 왼쪽 사이드 메뉴명 넘기기
            res.render('write/bigmodiy', {
              rows: menuResult,
              onerow: onerow,
            });
          }
        }
      });
    }
  });
});

/* 대분류 수정 액션 */
router.post('/write/bigmodiy',function (req, res, next) {
  loger.info('대분류 수정 진입  - /write/bigmodiy - write.js');

  var bignum = req.body.bignum;
  var section = req.body.sectiontext;
  var fileurl = req.body.fileurl;
  var title = req.body.title;
  var mainclose = req.body.mainclose;
  var pay = req.body.pay;
  var close = req.body.close;
  var price = req.body.price;
  var summernoteContent = req.body.summernoteContent;
  var imagepath = req.body.imagepath;
  var lang = req.body.lang;

  var updatesql = 'update bigTbl set title = ? ,description = ? ,close = ? ,pay = ?,mainclose = ?, section = ?, price = ?, fileurl = ?, image = ? , lang = ? where bignum = ?';
  var params = [title, summernoteContent, close, pay , mainclose, section, price,fileurl ,imagepath,lang, bignum];
  client.query(updatesql, params, function (err, rows, fields) {
    if (err) {
      loger.error('대분류 update 쿼리에 오류가 있습니다. - /write/bigmodiy - write.js');
      loger.error(err);
      res.send({ result: 'fail' , tocken:'수정실패'});
    } else {
      res.send({ result: 'success' , tocken:'수정성공'});
    }
  });
});


//중분류 글 수정
router.get('/write/middlemodiy', function (req, res, next) {

  var middlenum = req.query.num;       //중분류 pk 값

  loger.info(middlenum);

  var sql2 = 'select * from middleTbl where middlenum = ?';
  client.query(sql2, [middlenum], function (err2, onerow, results) {
    if (err2) {
      loger.error('대분류 글 하나 조회 문장에 오류가 있습니다. - /write/middlemodiy - /write.js');
      loger.error(err2);
    } else {
      //대분류 메뉴명 가져옴
      selectMenuQuery(function (err, menuResult) {
        if (err) {
          loger.info(err);
        } else {
          if (menuResult.length == 0) {
            res.render('write/middlemodiy', {
              rows: undefined,
              onerow: undefined,
              bigmenurows:undefined
            });
          } else {

            //bigTbl 조회 해서 값 뿌려주기
            var sql3 = 'select * from bigTbl';
            client.query(sql3, function (err3, bigmenurows, results2) {
              if (err3) {
                loger.error('대분류 조회 문장에 오류가 있습니다. - /write/middlemodiy - /write.js');
                loger.error(err3);
              } else {
                //수정할 대분류 글과 왼쪽 사이드 메뉴명 넘기기
                res.render('write/middlemodiy', {
                  rows: menuResult,
                  onerow: onerow,
                  bigmenurows:bigmenurows
                });
              }
            });
          }
        }
      });
    }
  });
});


/* 중분류 수정 액션 */
router.post('/write/middlemodiy',function (req, res, next) {
  loger.info('중분류 수정 진입  - /write/middlemodiy - write.js');

  var bignum = req.body.bignum;
  var middlenum = req.body.middlenum;
  var middletitle = req.body.middletitle;
  var close = req.body.close;
  var summernoteContent = req.body.summernoteContent;


  var updatesql = 'update middleTbl set title = ? , description = ? , close = ?, bignum = ?  where middlenum = ?';
  var params = [middletitle, summernoteContent, close, bignum, middlenum];
  client.query(updatesql, params, function (err, rows, fields) {
    if (err) {
      loger.error('중분류 update 쿼리에 오류가 있습니다. - /write/middlemodiy - write.js');
      loger.error(err);
      res.send({ result: 'fail' , tocken:'수정실패'});
    } else {
        res.send({ result: 'success' , tocken:'수정성공'});
    }
  });
});




//포스트 글 수정
router.get('/write/postmodiy', function (req, res, next) {

  var postnum = req.query.postnum;       //post pk 값
  var middlenum = req.query.middlenum;       //middle pk 값
  loger.info(postnum);
  loger.info(middlenum);
  
  var sql1 = 'select * from bigTbl';
  client.query(sql1, function (err1, bigrows, results) {
    if (err1) {
      loger.error('대분류 메뉴 조회 문장에 오류가 있습니다. - /write/writemodiy - /write.js');
      loger.error(err1);
    } else {

      var sql11 = 'select * from middleTbl';
      client.query(sql11, function (err11, middlerows, results) {
        if (err11) {
          loger.error('중분류 메뉴 조회 문장에 오류가 있습니다. - /write/writemodiy - /write.js');
          loger.error(err11);
        } else {
          var sql2 = 'select * from middleTbl where middlenum = ?';
          client.query(sql2, [middlenum], function (err2, middlerow, results) {
            if (err2) {
              loger.error('대분류 글 하나 조회 문장에 오류가 있습니다. - /write/writemodiy - /write.js');
              loger.error(err2);
            } else {
              //대분류 메뉴명 가져옴
              selectMenuQuery(function (err, menuResult) {
                if (err) {
                  loger.info(err);
                } else {
                  if (menuResult.length == 0) {
                    res.render('write/writemodiy', {
                      rows: undefined,
                      middlerow: middlerow,
                      bigrows:bigrows,
                      middlerows:middlerows
                    });
                  } else {
    
                    var sql3 = 'select * from postTbl where postnum = ?';
                    client.query(sql3, [postnum], function (err3, postrow, results) {
                      if (err3) {
                        loger.error('post 조회 문장에 오류가 있습니다. - /write/writemodiy - /write.js');
                        loger.error(err3);
                      } else {
    
                        //수정할 대분류 글과 왼쪽 사이드 메뉴명 넘기기 + post 관련 데이터 넘기기
                        res.render('write/writemodiy', {
                          rows: menuResult,
                          middlerow: middlerow,
                          bigrows: bigrows,
                          middlerows:middlerows,
                          postrow:postrow
                        });
    
                      }
                    });
                  }
                }
              });
            }
          });
        }
      })
    }
  });
});

/* 포스트 수정 액션 */
router.post('/write/writemodiy',function (req, res, next) {
  loger.info('중분류 수정 진입  - /write/middlemodiy - write.js');
 
  var postnum = req.body.postnum;
  var videourl = req.body.videourl;
  var videotime = req.body.videotime;
  var posttitle = req.body.posttitle;
  var cansee = req.body.cansee;
  var close = req.body.close;
  var middlenum = req.body.middlenum;
  var summernoteContent = req.body.summernoteContent;




  var updatesql = 'update postTbl set title = ? , description = ? , close = ?, cansee = ? , middlenum = ?, videourl = ?, videotime = ? where postnum = ?';
  var params = [posttitle, summernoteContent, close, cansee, middlenum, videourl,videotime,postnum];
  client.query(updatesql, params, function (err, rows, fields) {
    if (err) {
      loger.error('post update 쿼리에 오류가 있습니다. - /write/writemodiy - write.js');
      loger.error(err);
      res.send({ result: 'fail' , tocken:'수정실패'});
    } else {
        res.send({ result: 'success' , tocken:'수정성공'});
    }
  });
});

module.exports = router;
loger.info("메모리 로딩 완료. - write.js");


