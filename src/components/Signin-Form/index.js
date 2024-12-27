"use client"

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import Link from "next/link";
import { SignInAction } from "@/app/actions/Useractions";
import { useRouter } from 'next/navigation'; 

export default function SignInForm() {
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setSubmitError("");
            setSubmitSuccess(false);
            
            const response = await SignInAction(data);
            
            if (response.success) {
                setSubmitSuccess(true);
                reset();
                setTimeout(() => {
                    router.push("/");
                     
                }, 1500);
            } else {
                setSubmitError(response.message || 'Invalid email or password');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitError('An error occurred. Please try again.');
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Welcome back! Please login to your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Please enter a valid email",
                                },
                            })}
                            className={errors.email ? "border-red-500" : ""}
                            aria-invalid={errors.email ? "true" : "false"}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: "Password is required"
                            })}
                            className={errors.password ? "border-red-500" : ""}
                            aria-invalid={errors.password ? "true" : "false"}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {submitError && (
                        <Alert variant="destructive">
                            <AlertDescription>{submitError}</AlertDescription>
                        </Alert>
                    )}

                    {submitSuccess && (
                        <Alert className="bg-green-50">
                            <AlertDescription>
                                Login successful! Redirecting...
                            </AlertDescription>
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
                
                <div className="mt-4 text-center">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link 
                        href="/Signup" 
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}