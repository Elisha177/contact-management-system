const Contact = require('../models/Contact');
const Joi = require('joi');

// Add a new contact
exports.addContact = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    timezone: Joi.string().required(),
  });
  
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const contact = await Contact.create({ ...req.body, user: req.user.id });
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: 'Error adding contact.' });
  }
};
