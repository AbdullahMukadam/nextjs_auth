// app/actions/Useractions.js
'use server'

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ConnectToDb from "@/database/ConnectToDb";
import User from "@/models/UserModels";
import { cookies } from 'next/headers';

export async function SignUpAction(data) {
    try {
        await ConnectToDb();

        const { email, name, password } = data;

        if (!email || !name || !password) {
            return {
                success: false,
                message: "All Fields Are Required"
            };
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return {
                success: false,
                message: "Email Already Exists"
            };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        const cookieStore = await cookies();
        cookieStore.set("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60
        });

        return {
            success: true,
            message: "User Created Successfully",
            user: {
                name: newUser.name,
                email: newUser.email,
                id: newUser._id.toString()
            }
        };

    } catch (error) {
        console.error('SignUp Error:', error);
        return {
            success: false,
            message: "Internal Server Error"
        };
    }
}

export async function SignInAction(data) {
    try {
        await ConnectToDb();

        const { email, password } = data

        if (!email || !password) {
            return {
                success: false,
                message: "Data Not received"
            }
        }

        const EmailExits = await User.findOne({ email })
        if (!EmailExits) {
            return {
                success: false,
                message: "User Not Found"
            }
        } else {
            const comparePassword = await bcrypt.compare(password, EmailExits.password)
            if (comparePassword) {
                const token = jwt.sign(
                    { userId: EmailExits._id.toString() },
                    process.env.JWT_SECRET,
                    { expiresIn: "30d" }
                );
                if (token) {
                    const cookieStore = await cookies();
                    cookieStore.set("jwt", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 30 * 24 * 60 * 60
                    });

                    return {
                        success: true,
                        message: "Succesfully Signed Up",
                        user: {
                            name: EmailExits.name,
                            email: EmailExits.email,
                            id: EmailExits._id.toString()
                        }
                    };
                }
            }
        }




    } catch (error) {
        return {
            success: false,
            message: "Internal Server Error"
        }
    }
}

export async function SignOutAction() {
    try {
        const cookieStore = await cookies();
        const response = cookieStore.set("jwt", "")
        if (response) {
            return {
                success: true,
                message: "Logout Succesfully"
            }
        }
    } catch (error) {
        return {
            success: false,
            message: "Error in Logout"
        }
    }
}