exports.get404 = (req, res, next) => {
  res.status(404).render('404', { 
  pageTitle: 'Page Not Found', 
  path: '/404',
  deleted: false,
  isAuthenticated: req.session.isLoggedIn });
};
