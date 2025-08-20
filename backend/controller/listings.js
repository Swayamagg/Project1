const Listing=require("../models/listing");


module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};


module.exports.newRoute=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showRoute=async(req,res)=>{
    let {id}=req.params;
    const listDetails=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listDetails){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listDetails});
};

module.exports.createRoute=async (req,res)=>{
    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    await newlisting.save();
    console.log(newlisting);
    req.flash("success","New listing added!");
    res.redirect("/listings");
};


module.exports.editRoute=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
};

module.exports.updateRoute=async(req,res)=>{
      let {id}=req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
        req.flash("success","Listing updated!");
      res.redirect(`/listings/${id}`);
};

module.exports.deleteRoute=async(req,res)=>{
    let {id}=req.params;
    let deletedList=await Listing.findByIdAndDelete(id);
    console.log(deletedList);
      req.flash("success","Listing deleted!");
    res.redirect("/listings");
};