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
  //대분류 메뉴명 가져옴
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
  //대분류 메뉴명 가져옴
  selectMenuQuery(function(err, menuResult) {
    if(err){
      loger.info(err);
    }else{
      if(menuResult.length == 0){
        res.render('write/middlewrite',{
          rows:undefined
        });
      }else{
        res.render('write/middlewrite',{
          rows:menuResult
        });
      }
    }
  }); 
});

/* 소분류 작성 */
router.get('/write/write', function (req, res, next) {
  //대분류 메뉴명 가져옴
  selectMenuQuery(function(err, menuResult) {
    if(err){
      loger.info(err);
    }else{
      if(menuResult.length == 0){
        res.render('write/write',{
          rows:undefined
        });
      }else{
        res.render('write/write',{
          rows:menuResult
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
  //대분류 메뉴명 가져옴
  selectMenuQuery(function(err, menuResult) {
    if(err){
      loger.info(err);
    }else{
      if(menuResult.length == 0){
        res.render('write/writepost',{
          rows:undefined
        });
      }else{
        res.render('write/writepost',{
          rows:menuResult
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
  
  loger.info(posttitle);
  loger.info(close);
  loger.info(middlenum);
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


//나의 포스터 저장 액션!
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







module.exports = router;
loger.info("메모리 로딩 완료. - write.js");


