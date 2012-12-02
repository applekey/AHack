
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.english = function(req, res){
  res.render('english', { title: 'Express' })
};

exports.medical = function(req, res){
  res.render('medical', { title: 'Express' })
};