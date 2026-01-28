const Group = require('../models/group');
const Expense = require('../models/expense');

const generateInvitationCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate Group model
    if (!Group || typeof Group.findOne !== 'function') {
      console.error('Group model is not valid:', Group);
      return res.status(500).json({ message: 'Database model error' });
    }

    let invitationCode = generateInvitationCode();

    // Ensure unique invitation code
    let existingGroup = await Group.findOne({ invitationCode });
    while (existingGroup) {
      invitationCode = generateInvitationCode();
      existingGroup = await Group.findOne({ invitationCode });
    }

    const group = new Group({
      name,
      description,
      invitationCode,
      createdBy: req.user._id,
      members: [req.user._id]
    });

    await group.save();
    await group.populate('members', 'name email');
    await group.populate('createdBy', 'name email');

    res.status(201).json(group);
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ message: error.message || 'Failed to create group' });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const { invitationCode } = req.body;

    if (!Group || typeof Group.findOne !== 'function') {
      return res.status(500).json({ message: 'Database model error' });
    }

    const group = await Group.findOne({ invitationCode });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member of this group' });
    }

    group.members.push(req.user._id);
    await group.save();
    await group.populate('members', 'name email');
    await group.populate('createdBy', 'name email');

    res.json(group);
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ message: error.message || 'Failed to join group' });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    // Validate Group model
    if (!Group || typeof Group.find !== 'function') {
      console.error('Group model is not valid:', Group);
      return res.status(500).json({ message: 'Database model error' });
    }

    // Validate user
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const groups = await Group.find({ members: req.user._id })
      .populate('members', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    console.error('Get user groups error:', error);
    res.status(500).json({ message: error.message || 'Failed to load groups' });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    if (!Group || typeof Group.findById !== 'function') {
      return res.status(500).json({ message: 'Database model error' });
    }

    const group = await Group.findById(req.params.id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.some(m => m._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }

    res.json(group);
  } catch (error) {
    console.error('Get group by ID error:', error);
    res.status(500).json({ message: error.message || 'Failed to load group' });
  }
};