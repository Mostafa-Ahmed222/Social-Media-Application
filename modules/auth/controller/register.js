import userModel from "../../../DB/model/User.model.js";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import { myEmail } from "../../../service/nodemailerEmail.js";

export const signup = async (req, res) => {
  const { name, email, password, gender, age } = req.body;
  try {
    const user = await userModel.findOne({ email }).select("email");
    if (user) {
      res.status(400).json({ message: "Email exist" });
    } else {
      const hashPassword = bcrypt.hashSync(
        password,
        parseInt(process.env.SALTROUND)
      );
      const newUser = new userModel({
        name,
        email,
        password: hashPassword,
        gender,
        age,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign(
        { id: savedUser._id },
        process.env.confirmEmailToken,
        { expiresIn: 60 * 60 * 10 }
      );
      const retoken = jwt.sign(
        { id: savedUser._id },
        process.env.confirmEmailToken,
        { expiresIn: "1h" }
      );
      const confirmLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
      const refLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/reConfirmEmail/${retoken}`;
      const message = `
            <a href= ${confirmLink}>follow link to confirm your email</a>
            <br>
            <br>
            <a href= ${refLink}>follow link to Reconfirm your email</a>
            `;
      await myEmail(savedUser.email, "Confirm Email", message);
      res.status(201).json({ message: "Done Check your email" });
    }
  } catch (error) {
    res.status(500).json({ message: "Catch error", error });
  }
};
export const confirmEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.confirmEmailToken);
    if (!decoded?.id) {
      res.status(400).json({ message: "In-valid Payload" });
    } else {
      const user = await userModel
        .findById(decoded.id)
        .select("email confirmEmail Qrcode");
      if (!user) {
        res.status(404).json({ message: "In-Valid Token id" });
      } else {
        if (user.confirmEmail) {
          res.status(400).json({ message: "email already confirmed" });
        } else {
          const profileLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/user/shareProfile/${user._id}`;
          QRCode.toDataURL(`${profileLink}`, async (err, url) => {
            await userModel.updateOne(
              { email: user.email },
              { Qrcode: url, confirmEmail: true }
            );
            res.status(200).json({ message: "Done please signin" });
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Catch error", error });
  }
};
export const refreshToken = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.confirmEmailToken);
    if (!decoded?.id) {
      res.status(400).json({ message: "In-valid Payload" });
    } else {
      const user = await userModel
        .findById(decoded.id)
        .select("email confirmEmail Qrcode");
      if (!user) {
        res.status(404).json({ message: "In-Valid Token id" });
      } else {
        if (user.confirmEmail) {
          res.status(400).json({ message: "email already confirmed" });
        } else {
          const token = jwt.sign(
            { id: user._id },
            process.env.confirmEmailToken,
            { expiresIn: 60 * 60 * 10 }
          );
          const confirmLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
          const message = `
            <a href= ${confirmLink}>follow link to confirm your email</a>
            `;
          await myEmail(user.email, "ReConfirm Email", message);
          res.status(200).json({ message: "Done Check your email" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Catch error", error });
  }
};
export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "In-Valid account" });
    } else {
      if (!user.confirmEmail) {
        res.status(400).json({ message: "confirm your email first" });
      } else {
        const match = bcrypt.compareSync(password, user.password);
        if (!match) {
          res.status(404).json({ message: "In-Valid account" });
        } else {
          const token = jwt.sign(
            { id: user._id, isLoggedIn: true },
            process.env.TOKENSIGNATURE,
            { expiresIn: 60 * 60 * 24 }
          );
          res.status(200).json({ message: "Done", token });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Catch error", error });
  }
};
