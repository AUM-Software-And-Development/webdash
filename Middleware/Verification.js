module.exports = {
   ensureAdministrator: function (request, response, next) {
      if (request.isAuthenticated()) {
         return next()
      }
      else {
         response.render("Errors/Restricted")
      }
   },
   ensureInactive: function (request, response, next) {
      if (request.isAuthenticated()) {
         response.redirect("/dashboard")
      }
      else {
         return next()
      }
   }
}