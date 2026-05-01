const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Item = require('../models/Item');
const sendEmail = require('../utils/email');

// ======================
// Add Item Page
// ======================
router.get('/add-item', (req, res) => {

             if (!req.session.user) return res.redirect('/login');

             res.render('add-item');
});

// ======================
// Add Item Logic
// ======================
router.post('/add-item', async (req, res) => {

              if (!req.session.user) return res.redirect('/login');

              let { itemName, description, location } = req.body;

              itemName = itemName.trim();
    description = description ? description.trim() : '';
    location = location ? location.trim() : '';

              const existingItem = await Item.findOne({
                    user: req.session.user._id,
                    itemName
              });

              if (existingItem) {
                    return res.send("Item with this name already exists.");
              }

              const item = new Item({
                    user: req.session.user._id,
                    itemName,
                    description,
                    location
              });

              await item.save();

              const qrUrl = `http://localhost:3000/item/${item._id}`;
    const qrImage = await QRCode.toDataURL(qrUrl);

              item.qrCode = qrImage;
    await item.save();

              res.redirect('/dashboard');
});

// ======================
// Public Item Page
// ======================
router.get('/item/:id', async (req, res) => {

             const item = await Item.findById(req.params.id).populate('user');

             if (!item) {
                   return res.send("Item not found");
             }

             item.scanCount += 1;
    await item.save();

             res.render('public-item', { item });
});

// ======================
// Delete Item
// ======================
router.get('/delete/:id', async (req, res) => {

             if (!req.session.user) return res.redirect('/login');

             await Item.deleteOne({
                   _id: req.params.id,
                   user: req.session.user._id
             });

             res.redirect('/dashboard');
});

// ======================
// Mark Lost
// ======================
router.get('/lost/:id', async (req, res) => {

             if (!req.session.user) return res.redirect('/login');

             const item = await Item.findOne({
                   _id: req.params.id,
                   user: req.session.user._id
             }).populate('user');

             if (!item) return res.redirect('/dashboard');

             item.status = 'lost';
    await item.save();

             try {
                   await sendEmail(
                           item.user.email,
                           'Your Item is Marked LOST',
                           `Hello ${item.user.name},\n\nYour item "${item.itemName}" has been marked as LOST.\n\nQR Lost & Found System`
                         );
             } catch (err) {
                   console.log("Email Error:", err.message);
             }

             res.redirect('/dashboard');
});

// ======================
// Mark Found
// ======================
router.get('/found/:id', async (req, res) => {

             if (!req.session.user) return res.redirect('/login');

             const item = await Item.findOne({
                   _id: req.params.id,
                   user: req.session.user._id
             }).populate('user');

             if (!item) return res.redirect('/dashboard');

             item.status = 'safe';
    await item.save();

             try {
                   await sendEmail(
                           item.user.email,
                           'Good News! Your Item is Safe',
                           `Hello ${item.user.name},\n\nYour item "${item.itemName}" is now SAFE.\n\nQR Lost & Found System`
                         );
             } catch (err) {
                   console.log("Email Error:", err.message);
             }

             res.redirect('/dashboard');
});

// ======================
// Edit Page
// ======================
router.get('/edit/:id', async (req, res) => {

             if (!req.session.user) return res.redirect('/login');

             const item = await Item.findOne({
                   _id: req.params.id,
                   user: req.session.user._id
             });

             if (!item) return res.redirect('/dashboard');

             res.render('edit-item', { item });
});

// ======================
// Edit Logic
// ======================
router.post('/edit/:id', async (req, res) => {

              if (!req.session.user) return res.redirect('/login');

              const { itemName, description, location } = req.body;

              await Item.findOneAndUpdate(
                { _id: req.params.id, user: req.session.user._id },
                {
                        itemName: itemName.trim(),
                        description: description.trim(),
                        location: location.trim()
                }
                  );

              res.redirect('/dashboard');
});

module.exports = router;
