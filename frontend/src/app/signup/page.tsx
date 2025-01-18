"use client";

import { z } from "zod";
import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { setCookie } from "cookies-next";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { CONFIGS } from "@/configs";
import { APIVersion1Register } from "@/http";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/hoc/auth-layout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z
    .object({
        name: z.string({ required_error: "Name is required" }).min(1, { message: "Name is required" }),
        email: z.string({ required_error: "Email is required" }).email({ message: "Invalid email" }),
        password: z.string({ required_error: "Password is required" }).min(8, { message: "Password must be at least 8 characters" }),
        confirm_password: z.string({ required_error: "Confirm password is required" }),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"],
    });

function SignUpPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const { mutateAsync: register, isPending: isRegistering } = useMutation({
        mutationFn: APIVersion1Register,
        onSuccess: async ({ data }: { data: { token: { access_token: string; refresh_token: string }; user: { id: string } } }) => {
            const { tokens } = data;

            // Set tokens in cookies
            setCookie(CONFIGS.AUTH.ACCESS_TOKEN_NAME, tokens.access_token);
            setCookie(CONFIGS.AUTH.REFRESH_TOKEN_NAME, tokens.refresh_token);

            window.location.href = CONFIGS.AUTH.AUTHORIZED_REDIRECT;
        },
    });

    const onSubmit = React.useCallback(
        async (data: z.infer<typeof formSchema>) => {
            toast.promise(
                register({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
                {
                    loading: "Registering...",
                    success: "Registered successfully",
                    error: (error) => error?.response?.data?.message || "Failed to register",
                }
            );
        },
        [register, form]
    );

    return (
        <AuthLayout
            cardTitle="Create an account!"
            cardDescription="Kindly fill the information below to create an account."
            extra={
                <div className="flex justify-center pb-24">
                    <p className="bg-white text-sm py-4 px-7 rounded-full shadow-sm border">
                        Already have an account?{" "}
                        <Link href="/signin" className="font-bold text-primary hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full flex flex-col">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirm_password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Confirm password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="">
                        <Button type="submit" className="mt-4 w-full" disabled={isRegistering}>
                            {isRegistering && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                            Sign Up
                        </Button>
                    </div>
                </form>
            </Form>
        </AuthLayout>
    );
}

export default function SigninPageWrapper() {
    return (
        <React.Suspense fallback={null}>
            <SignUpPage />
        </React.Suspense>
    );
}
