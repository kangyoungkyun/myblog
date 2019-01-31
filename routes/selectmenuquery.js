var client = require('../config/mysqlconfig.js'); //mysql 모듈


/* 메뉴명 가져오는 쿼리  */
var selectMenuQuery = function ( callback ) {
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


module.exports = selectMenuQuery;










  