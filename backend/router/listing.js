const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLogged,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controller/listings.js");




//index route
router.get("/",wrapAsync(listingController.index));
//new route
router.get("/new",isLogged,listingController.newRoute);


//Show route
router.get("/:id",wrapAsync(listingController.showRoute));
//create route
router.post("/",isLogged,validateListing,wrapAsync(listingController.createRoute));

//EDIT Route
router.get("/:id/edit",isLogged,isOwner,wrapAsync(listingController.editRoute));
//UPDATE Route
router.put("/:id",isLogged,isOwner,validateListing,wrapAsync(listingController.updateRoute));

router.delete("/:id",isLogged,isOwner,wrapAsync(listingController.deleteRoute));   
module.exports=router;