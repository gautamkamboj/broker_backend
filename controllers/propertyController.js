import { Property } from "../models/propertySchema.js";
import { User } from "../models/userSchema.js";
import cloudinary from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });



export const createProperty = async (req, res) => {
  try {
    const { propertyName, address, description, type, price, furnished, parking } = req.body;
    const images = [];

    // Upload images to Cloudinary
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'your_folder_name',
      });

      images.push(result.secure_url);
    }
    
    // Find the user by ID
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create a new property
    const property = await Property.create({
      propertyName,
      address,
      owner: req.user.userId, // Set the owner field with the user's ID
      description,
      type,
      price,
      furnished,
      parking,
      images,
    });

    res.status(201).json({ success: true, property });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const listProperty =async(req,res)=>{
  try {
    const properties = await Property.find({});

    res.status(200).json({ success: true, properties });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const userProperty =async(req,res)=>{
  try {
    
    // Search for properties based on name, description, or image URLs
    const properties = await Property.find({
      $or: [
        {owner: req.user.userId},
      
      ],
    }).populate('owner', 'username');

    res.status(200).json({ success: true, properties });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

export const searchProperties = async (req, res) => {
  try {
    const  {id}  = req.params;

   

    // Search for properties based on name, description, or image URLs
    const properties = await Property.find({
      $or: [
        {_id: id},
        { propertyName: id },
        { description:id },
       {address: id}
      ],
    }).populate('owner', 'username');

    res.status(200).json({ success: true, properties });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the property by ID and remove it
    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


export const updateProperty = async (req, res) => {
 

  try {
    const { id } = req.params;
    const { propertyName, address, owner, description, type, price, furnished, parking } = req.body;

    // Find the property by ID
    const property = await Property.findById(id);
   
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Update property fields
    property.propertyName = propertyName || property.propertyName;
    property.address = address || property.address;
    property.owner = req.user.userId;
    property.description = description || property.description;
    property.type = type || property.type;
    property.price = price || property.price;
    property.furnished = furnished || property.furnished;
    property.parking = parking || property.parking;

    // Upload new images to Cloudinary if provided
    if (req.files && req.files.length > 0) {
      const newImages = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'Home', // Specify the folder name in Cloudinary
        });

        newImages.push(result.secure_url);
      }

      // Concatenate new images with existing images
      property.images = [...property.images, ...newImages];
    }

    // Save the updated property
    const updatedProperty = await property.save();

    res.status(200).json({ success: true, property: updatedProperty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};