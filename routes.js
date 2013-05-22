// API routes
module.exports = function(app, api) {
  app.get('/', api.root);
  app.get('/api/users', api.users);
  app.get('/api/user/:email', api.user_by_email);
  app.get('/api/collections/:user_id', api.collections_by_user);
  app.get('/api/collection/:url', api.collection_by_url);
};