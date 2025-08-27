const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");



main()
.then(()=>{
    console.log("connection");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

const initDB=async()=>{
    await Listing.deleteMany({});
    const listings = initData.data.map(listing => ({
        ...listing,
        image: listing.image,
        owner:"68a2ff2ccc53de9cd459bc19"
    }));
    await Listing.insertMany(listings);
    console.log("data saved");
}
initDB();