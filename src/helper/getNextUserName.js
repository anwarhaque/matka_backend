const UserCounter = require('../modules/user/models/userCounterModel');

const getNextUserName = async () => {
  const counter = await UserCounter.findByIdAndUpdate(
    { _id: 'userName' }, // Identifier for the counter
    { $inc: { sequenceValue: 1 } }, // Increment the sequence by 1
    { new: true, upsert: true } // Create if it doesn't exist
  );
  
  // Ensure it's a 4-digit number, starting from 1000
  if (counter.sequenceValue < 1000) {
    counter.sequenceValue = 1000;
    await counter.save();
  }

  return counter.sequenceValue;
};

module.exports = getNextUserName;