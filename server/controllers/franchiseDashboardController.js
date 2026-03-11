const FranchiseDashboard = require("../models/franchiseDashboardModel");

exports.createFranchiseDashboard = async (req,res)=>{

  try{

    const data = req.body;

    const profilePhotoFilename = req.files?.profilePhoto?.[0]?.filename;

    const dashboard = new FranchiseDashboard({

      ...data,

      photoUrl: profilePhotoFilename ? `/uploads/${profilePhotoFilename}` : data.photoUrl,

      documents:{
        panCard: req.files?.panCard?.[0]?.filename,
        aadhaarCard: req.files?.aadhaarCard?.[0]?.filename,
        gstCertificate: req.files?.gstCertificate?.[0]?.filename
      }

    });

    await dashboard.save();

    res.json({
      success:true,
      message:"Franchise Dashboard Created",
      data:dashboard
    });

  }catch(err){

    res.status(500).json({
      success:false,
      message:err.message
    });

  }

};


exports.getFranchiseDashboard = async (req,res)=>{

  const data = await FranchiseDashboard.findById(req.params.id);

  res.json(data);

};
