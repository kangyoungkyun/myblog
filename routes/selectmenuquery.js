var client = require('../config/mysqlconfig.js'); //mysql 모듈


/* 메뉴명 가져오는 쿼리  */
var selectMenuQuery = function ( callback ) {
  var sql = ' select bigTbl.description as description, bigTbl.mainclose as mainclose , bigTbl.bignum as bignum, bigTbl.title as title , bigTbl.section as section, bigTbl.close as close, bigTbl.lang as lang, bigTbl.image as image,  count(*) as cnt ' +
            ' from bigTbl, middleTbl ,postTbl ' + 
            ' where bigTbl.bignum = middleTbl.bignum ' +
            ' and middleTbl.middlenum = postTbl.middlenum ' +
            ' group by bigTbl.bignum';

  client.query(sql, function(err, rows, results) {
      if (err) {
           callback(err);
           return;
      }else{
        callback(null, rows); 
      }
  });
};


module.exports = selectMenuQuery;










  