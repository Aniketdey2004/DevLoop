import Notification from "../models/Notification.js";

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("relatedUser", "username profilePic")
      .populate("relatedPost", "content image")
      .populate("projectId","title description")
      .sort({createdAt:-1});
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getAllNotifications Controller",error);
    res.status(500).json({message:"Internal Server Error"});
  }
};

export const markNotificationAsRead=async(req,res)=>{
    const {notificationIds}=req.body;
    try {
       const notification=await Notification.updateMany({_id:{$in:notificationIds},recipient:req.user._id},{read:true});
       if(notification.modifiedCount==0){
        return res.status(404).json({message:"Notification not found"});
       } 
       res.status(200).json({message:"Notification marked read"});
    } catch (error) {
        console.log("Error in markNotificationAsRead controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};


export const deleteNotification=async(req,res)=>{
    const notificationId=req.params.id;
    try {
        const notification=await Notification.findOneAndDelete({_id:notificationId,recipient:req.user._id});
        if(!notification){
            return res.status(404).json({message:"Notification not found"});
        }
        res.status(200).json({message:"Notification deleted"});
    } catch (error) {
        console.log("Error in deleteNotification controller",error);
        res.status(500).json({message:"Internal Server Error"});
    };
}