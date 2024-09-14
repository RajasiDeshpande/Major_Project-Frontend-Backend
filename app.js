const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port=8080;
const Listing=require("./models/listing.js");
const path=require("path");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
//app.set('views', __dirname + '/views/layouts')
app.set("views",path.join(__dirname,"views/listing"));
//app.set("views",path.join(__dirname,"views/layouts"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err);
})
app.listen(port,()=>{
    console.log(`server is listening through port ${port}`);
})
app.get("/",(req,res)=>{
    res.send("Hi I am root");
})
//Index Route
app.get("/listing",async(req,res)=>{
    const list=await Listing.find({});
    res.render("index.ejs",{list});
})
//New Route  (always put before bcz searching for id first will make database search new in db first)
app.get("/listing/new",(req,res)=>{
    res.render("new.ejs");
})

//Show Route
app.get("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    const detail= await Listing.findById(id);
    res.render("show.ejs",{detail});
})

//Create Route
app.post("/listing",(req,res)=>{
    let {title,description,price,country,location}=req.body;
    let newListing=new Listing({
        title:title,
        description:description,
        price:price,
        country:country,
        location:location
    })
    newListing.save();
    res.redirect("/listing");
})

//Edit Route
app.get("/listing/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const detail= await Listing.findById(id);
    res.render("edit.ejs",{detail});
})

//Update Route
app.put("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    let {title,description,image,price,country,location}=req.body;
    try{
        await Listing.findByIdAndUpdate(id,{
            title:title,
            description:description,
            image:image,
            price:price,
            country:country,
            location:location 
        })
    }
    catch(err){
        console.log(err);
    }
    
    res.redirect("/listing");
})

//Delete Route
app.delete("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    const deletedListing=await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
})