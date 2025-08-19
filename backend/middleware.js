const Listing = require("./models/listing");
const { listingSchema } = require("./app.js");
const ExpressError=require("./utils/ExpressError.js");


module.exports.isLogged=(req,res,next)=>{
     if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
      req.flash("error","you must be logged in");
      return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirect=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this property.")
    return res.redirect(`/listings/${id}`);
  }
  next();
}
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}