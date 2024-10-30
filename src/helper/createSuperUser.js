const User = require("../modules/user/models/userModel");
const getNextUserName = require("./getNextUserName");
const { generateSalt, generatePassword } = require("./jwtHelper");


exports.createSuperUser = async function () {
    try {
      const mobileNumber = "1234567890";
      const password = "123456";
      const userExist = await User.findOne({ mobileNumber });
      if (!userExist) {
        console.log("Super Does not Exist, Creating New");
        const salt = await generateSalt();

        const hashedPassword = await generatePassword(password, salt);

        // Get the next available userName
        const userName = await getNextUserName();

        const user = await User.create({ mobileNumber, userName, password: hashedPassword, name:"Super User", salt, userType: 'SUPER' });
        console.log(`Super (${user.userName}) Created Successfully.`);
      } else {
        console.log(`Super (${userExist.userName}) already exists.`);
      }
    } catch (error) {
      console.log(error);
      return
    }
  };