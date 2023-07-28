const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
// @desc Get all contacts
// @route GET /api/contacts
// @access private

const getContacts = asyncHandler(async (req, res) => {
  const contact = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contact);
});

// @desc create all contact
// @route POST /api/contacts
// @access private

const createContact = asyncHandler(async (req, res) => {
  console.log("Request Body is :", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory");
  } else {
    const contact = await Contact.create({
      name,
      email,
      phone,
      user_id: req.user.id,
    });
    res.status(201).json(contact);
  }
});

// @desc Get single contact
// @route GET /api/contacts/:id
// @access private

const getContact = asyncHandler(async (req, res) => {
  const timeout = 5000; // Set a timeout value (in milliseconds), e.g., 5000ms (5 seconds)
  const contactPromise = Contact.findById(req.params.id);

  // Use Promise.race to race the actual operation against a timeout promise
  try {
    const contact = await Promise.race([
      contactPromise, // The actual asynchronous operation
      new Promise((_, reject) => {
        // A timeout promise that rejects after the specified timeout
        setTimeout(() => reject(new Error("Operation timed out")), timeout);
      }),
    ]);

    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    }

    res.status(200).json(contact);
  } catch (error) {
    // Handle the error appropriately
    res.status(404);
    throw new Error("Contact not found");
  }
});

// @desc update contacts
// @route PUT /api/contacts
// @access private

const updateContact = asyncHandler(async (req, res) => {
  const timeout = 5000; // Set a timeout value (in milliseconds), e.g., 5000ms (5 seconds)
  const contactPromise = Contact.findById(req.params.id);

  // Use Promise.race to race the actual operation against a timeout promise
  try {
    const contact = await Promise.race([
      contactPromise, // The actual asynchronous operation
      new Promise((_, reject) => {
        // A timeout promise that rejects after the specified timeout
        setTimeout(() => reject(new Error("Operation timed out")), timeout);
      }),
    ]);

    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    }
    if (contact.user_id.toString() !== req.user.id) {
      res.status(403);
      throw new Error(
        "User don't have permission to update other user contacts"
      );
    }
    const updateContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updateContact);
  } catch (error) {
    // Handle the error appropriately
    res.status(404);
    throw new Error("Contact not found");
  }
});

// @desc create all contacts
// @route DELETE /api/contacts:id
// @access private

const deleteContact = asyncHandler(async (req, res) => {
  const timeout = 5000; // Set a timeout value (in milliseconds), e.g., 5000ms (5 seconds)
  const contactPromise = Contact.findById(req.params.id);

  // Use Promise.race to race the actual operation against a timeout promise
  try {
    const contact = await Promise.race([
      contactPromise, // The actual asynchronous operation
      new Promise((_, reject) => {
        // A timeout promise that rejects after the specified timeout
        setTimeout(() => reject(new Error("Operation timed out")), timeout);
      }),
    ]);

    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    }
    if (contact.user_id.toString() !== req.user.id) {
      res.status(403);
      throw new Error(
        "User don't have permission to update other user contacts"
      );
    }
    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json(contact);
  } catch (error) {
    // Handle the error appropriately
    res.status(404);
    throw new Error("Contact not found");
  }
});

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
