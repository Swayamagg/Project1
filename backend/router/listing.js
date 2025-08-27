const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLogged,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controller/listings.js");
const multer=require("multer");
const {storage}=require("../config.js");
const upload=multer({storage});




//index route
router.get("/",wrapAsync(listingController.index)).post("/",isLogged,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createRoute));
//new route
router.get("/new",isLogged,listingController.newRoute);


//Show route
router.get("/:id",wrapAsync(listingController.showRoute));
//create route
router.post("/",isLogged,validateListing,wrapAsync(listingController.createRoute));

//EDIT Route
router.get("/:id/edit",isLogged,isOwner,wrapAsync(listingController.editRoute));
//UPDATE Route
router.put("/:id",isLogged,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateRoute));

router.delete("/:id",isLogged,isOwner,wrapAsync(listingController.deleteRoute));   
module.exports=router;