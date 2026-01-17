const FBSCModel = require('../models/fbscModel');

// Create new FBSC record
exports.createRecord = async (req, res) => {
  const user_id = req.user.user_id;
  const { customer_name, product, pair, price, record_date, notes } = req.body;

  // Validate required fields
  if (!customer_name || !product || !price || !record_date) {
    return res.status(400).json({ 
      message: 'Customer name, product, price, and date are required' 
    });
  }

  try {
    // Validate price is a number
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    const recordId = await FBSCModel.create({
      user_id,
      customer_name,
      product,
      pair: parseInt(pair) || 1,
      price: priceNum,
      record_date,
      notes
    });

    res.status(201).json({ 
      message: 'Record created successfully',
      record_id: recordId 
    });
  } catch (err) {
    console.error('[FBSC Create Error]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all FBSC records
exports.getRecords = async (req, res) => {
  try {
    const filters = {
      user_id: req.query.user_id || req.user?.user_id,
      from: req.query.from,
      to: req.query.to,
      product: req.query.product,
      search: req.query.search,
      limit: req.query.limit || 50,
      offset: req.query.offset || 0
    };

    const result = await FBSCModel.getAll(filters);
    res.json(result);
  } catch (err) {
    console.error('[FBSC Get Error]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get single record
exports.getRecordById = async (req, res) => {
  try {
    const record = await FBSCModel.getById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(record);
  } catch (err) {
    console.error('[FBSC GetById Error]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update record
exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate price if provided
    if (updates.price) {
      const priceNum = parseFloat(updates.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        return res.status(400).json({ message: 'Price must be a positive number' });
      }
      updates.price = priceNum;
    }

    if (updates.pair) {
      updates.pair = parseInt(updates.pair) || 1;
    }

    const updated = await FBSCModel.update(id, updates);
    if (!updated) {
      return res.status(404).json({ message: 'Record not found or no changes made' });
    }

    res.json({ message: 'Record updated successfully' });
  } catch (err) {
    console.error('[FBSC Update Error]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete record
exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FBSCModel.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error('[FBSC Delete Error]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get statistics
exports.getStats = async (req, res) => {
  try {
    const filters = {
      user_id: req.query.user_id || req.user?.user_id,
      from: req.query.from,
      to: req.query.to
    };

    const stats = await FBSCModel.getStats(filters);
    res.json(stats);
  } catch (err) {
    console.error('[FBSC Stats Error]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get unique products
exports.getProducts = async (req, res) => {
  try {
    const products = await FBSCModel.getProducts();
    res.json(products);
  } catch (err) {
    console.error('[FBSC Products Error]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};