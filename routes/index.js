
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'home' })
};

exports.english = function(req, res){
  res.render('english', { title: 'english' })
};

exports.medical = function(req, res){
  res.render('medical', { title: 'medical' })
};

exports.make = function(req,res){
	res.render('make',{title:'make'})
}