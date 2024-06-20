import { Message } from "../models/messageSchema.js";
import { Property } from "../models/propertySchema.js";
export const sendMessage = async (req, res) => {
  try {
    const { propertyId, content } = req.body;
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const message = new Message({
      sender: req.user.userId,
      receiver: property.owner,
      property: propertyId,
      content,
    });

    await message.save();

    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getMessages = async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [{ receiver: req.user.userId }],
      })
        .populate('sender', 'username')
        .populate('receiver', 'username')
        .populate('property', 'propertyName')
        .sort({ createdAt: -1 });
  
      res.status(200).json({ success: true, messages });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };