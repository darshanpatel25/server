const express = require('express')
const { requireSignIn, checkPermission } = require('../middlewares/authMiddleware')
const { createContactController, updateContactController, getAllContactsController, getSingleContactController, deleteContactController } = require('../controllers/contactController')

const router = express.Router()

//POST || Create contact

router.post("/create",checkPermission("create_contact"),createContactController)

//PUT || Update contact

router.put("/update",checkPermission("update_contact"),updateContactController)

//GET || Get ALl Contacts

router.get("/getallcontacts",checkPermission("read_contact"),getAllContactsController)

//GET || Get Single Contact

router.get("/get/:id",checkPermission("read_contact"),getSingleContactController)

//DELETE || Delete Contact

router.delete("/delete/:id",checkPermission('delete_contact'),deleteContactController)

module.exports = router