const csv = require('csv-parser');
const fs = require('fs');
const Contact = require('../models/Contact');

// Bulk add or update contacts via CSV upload
exports.uploadContacts = async (req, res) => {
  const filePath = req.file.path;

  try {
    const contacts = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        contacts.push(row); // Parse CSV row and push to array
      })
      .on('end', async () => {
        try {
          // Validate and save contacts
          for (const contact of contacts) {
            // Upsert contacts (update if exists, insert otherwise)
            await Contact.updateOne(
              { email: contact.email },
              { $set: contact },
              { upsert: true }
            );
          }
          res.json({ message: 'Contacts uploaded successfully' });
        } catch (error) {
          res.status(500).json({ message: 'Error uploading contacts', error });
        }
      });
  } catch (error) {
    res.status(500).json({ message: 'Error processing file', error });
  }
};

// Download all contacts as CSV
exports.downloadContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();

    const csvData = contacts.map(contact => ({
      Name: contact.name,
      Email: contact.email,
      Phone: contact.phone,
      Address: contact.address,
      Timezone: contact.timezone,
      CreatedAt: contact.createdAt,
    }));

    const csvContent = 'Name,Email,Phone,Address,Timezone,CreatedAt\n' + csvData.map(row =>
      `${row.Name},${row.Email},${row.Phone},${row.Address},${row.Timezone},${row.CreatedAt}`
    ).join('\n');

    res.setHeader('Content-disposition', 'attachment; filename=contacts.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading contacts', error });
  }
};
