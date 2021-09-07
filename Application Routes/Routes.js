const express = require('express')
const passport = require('passport')
const Responder = express.Router()
const TasksTable = require('../Models/Schema For Tasks Module')
const {ensureAdministrator, ensureInactive} = require("../Middleware/Verification")

Base:
Responder.get("/", (request, response) => {
   response.redirect("/dashboard")
})

Dashboard:
Responder.get("/dashboard", ensureAdministrator, async (request, response) => {
   try {
      // Uses the database object id to find the current administrator.
      const tasksFromTable = await TasksTable.find({Administrator: request.user.id}).lean()
      response.render("AdministratorDashboard", {
         // Sets a partial for the HTML
         CurrentFirstName: request.user.FirstName,
         // Pass the table data to the HTML render
         tasksFromTable,
         // Set backdrop to the main content
         layout: "Base-Dashboard"
      })
   } catch (err) {
      console.log(err)
      response.render("Errors/500")
   }
})

Hub:
Responder.get("/hub", async (request, response) => {
   console.log(request.user)
   try {
      const tasksFromTable = await TasksTable.find({Visibility: "Public"}).lean()
      response.render("Hub", {
         // Pass the table data to the HTML render
         tasksFromTable,
         // Set backdrop to the main content
         layout: "Base-Dashboard"
      })
   } catch (err) {
      console.log(err)
      response.render("Errors/500")
   }
})

Administrator:
Responder.get("/administrator", ensureInactive, (request, response) => {
   response.render("AdministratorLander", {
      layout: "Base-Dashboard"
   })
})

Authentication:
/* Uses a passport enumeration in the authenticate method
* Passport passes credentials using the oAuth tokens to google, 
* and google responds at the callback address.
*/
Responder.get("/administration/authentication/google", 
               passport.authenticate("google", { scope: ['profile']}))

Callback:
Responder.get("/authorization/google-callback", 
               passport.authenticate("google", { failureRedirect: "/"}), 
               (request, response) => {
                  // If successful, then redirect to dashboard
                  response.redirect("/dashboard")
               })

Logout:
Responder.get("/administration/logout", (request, response) => {
   request.logout()
   response.redirect("/")
})

TasksTableDatabase_Addition:
// Get
Responder.get("/newtask", ensureAdministrator, (request, response) => {
   response.render("Tasks/CreateNewTask", {layout: "Base-EditingTables"})
})

// Post
Responder.post("/", ensureAdministrator, async (request, response) => {
   try {
         request.body.Administrator = request.user.id
         await TasksTable.create(request.body)
         response.redirect("/dashboard")
   } catch (err) {
      console.log(err)
      response.render("Errors/500")
   }
})

module.exports = Responder