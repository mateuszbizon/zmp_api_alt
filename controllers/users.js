import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const signin = async (req, res) => {
	const { username, password } = req.body;

	try {
		const existingUser = await User.findOne({ username });

		if (!existingUser)
			return res.status(404).json({success: false, message: "Username or password is incorrect" });

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingUser.password
		);

		if (!isPasswordCorrect){
			return res.status(400).json({success: false, message: "Username or password is incorrect" });
        }

		const token = jwt.sign(
			{ email: existingUser.email, id: existingUser._id, username: existingUser.username },
			"test",
			{ expiresIn: "5h" }
		);

		res.status(200).json({success: true, message: token, userId: existingUser._id});
	} catch (error) {
		res.status(500).json({success: false, message: "Failed with server" });
	}
};

export const signup = async (req, res) => {
	const { email, username, password } = req.body;
	const selectedFile = '';

	try {
		const existingUser = await User.findOne({ email });

		if (existingUser)
			return res.status(400).json({success: false, message: "Email is already taken" });

		const existingUsername = await User.findOne({ username });

		if (existingUsername)
			return res.status(400).json({success: false, message: "Username is already taken" });

		const hashedPassword = await bcrypt.hash(password, 12);

		const result = await User.create({
			email,
			password: hashedPassword,
			username,
			selectedFile,
		});

		res.status(200).json({success: true, message: "Signed up successfully" });
	} catch (error) {
		res.status(500).json({ success: false, message: "Failed with server" });
	}
};

export const getUserDataProfile = async (req, res) => {
	const { id } = req.query;

	try {
		const user = await User.findById(id);

		if(!user) return res.status(404).json({ message: "User not found" });

		res.status(200).json({ selectedFile: user.selectedFile, username: user.username });
	} catch (error) {
		res.status(500).json({ message: "Failed with server"})
	}
}

export const getUsersBySearch = async (req, res) => {
	const { search } = req.query;
	
	try {
		const username = new RegExp(search, "i");
		const name = new RegExp(search, "i");
		
		const users = await User.find({$or: [{username}, {name}]});
		console.log(users)
		
		res.json(users);
	} catch (error) {
		res.status(404).json({ message: "User not found" });
	}
}