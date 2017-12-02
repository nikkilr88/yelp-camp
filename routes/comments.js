var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//===================
// Comments Routes
//===================

//Show new campground form
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
    
});

//Create new campground
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Something went wrong. :(")
            res.redirect("/campgrounds");
        } else {
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   console.log(req.user)
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/"+campground._id);
               }
           }); 
        }
    });
});

//Comments edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
       if(err) {
           console.log(err)
           res.redirect("/campgrounds");
       } else {
           res.render("comments/edit", {campground_id: req.params.id, comment: comment});
       }
    });
});

//Update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
       if(err){
           console.log(err);
           res.redirect("/campgrounds/" + req.params.id);
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

//Destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           req.flash("success", "Comment deleted.");
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});

module.exports = router;