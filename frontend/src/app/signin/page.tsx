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
import { APIVersion1Login } from "@/http";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/hoc/auth-layout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


const formSchema = z.object({
    email: z.string({ required_error: "Email is required" }).email({ message: "Invalid email" }),
    password: z.string({ required_error: "Password is required" }),
});

function SigninPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const { mutateAsync: login, isPending: isLoggingIn } = useMutation({
        mutationFn: APIVersion1Login,
        onSuccess({ data }) {
            const { tokens } = data;

            // Set access and refresh token
            setCookie(CONFIGS.AUTH.ACCESS_TOKEN_NAME, tokens.access_token);
            setCookie(CONFIGS.AUTH.REFRESH_TOKEN_NAME, tokens.refresh_token);

            window.location.href = CONFIGS.AUTH.AUTHORIZED_REDIRECT;
        },
    });

    const onSubmit = React.useCallback(
        async (data: z.infer<typeof formSchema>) => {
            toast.promise(
                login({
                    email: data.email,
                    password: data.password,
                }),
                {
                    loading: "Logging in...",
                    success: "Logged in successfully",
                    error: (error) => error?.response?.data?.message || "Failed to login",
                }
            );
        },
        [login, form]
    );

    return (
        <AuthLayout
            cardTitle="Welcome Back!"
            cardDescription="Please enter your details to sign in"
            extra={
                <div className="flex justify-center pb-24">
                    <p className="bg-white text-sm py-4 px-7 rounded-full shadow-sm border">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-bold text-primary hover:underline">
                            Signup
                        </Link>
                    </p>
                </div>
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full flex flex-col">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Enter email" {...field} />
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

                    <div className="">
                        <Button type="submit" className="mt-4 w-full" disabled={isLoggingIn}>
                            {isLoggingIn && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                            Sign In
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
            <SigninPage />
        </React.Suspense>
    );
}
