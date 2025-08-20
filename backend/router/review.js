const express=require("express");
const router=express.Router({mergeParams:true});

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema } = require("../app.js");
const {isLogged,isAuthor}=require("../middleware.js");
const reviewController=require("../controller/reviews.js");


const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errmsg);
    }else{
        next();
    }
}

//Review route
router.post("/",isLogged,validateReview,wrapAsync(reviewController.createReview));

//DELETE REVIEW
router.delete("/:reviewId",isLogged,isAuthor,wrapAsync(reviewController.deleteReview));
module.exports=router;