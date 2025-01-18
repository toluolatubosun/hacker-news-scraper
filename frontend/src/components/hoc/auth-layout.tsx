import type React from "react";

import Logo from "@/components/custom/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthLayoutProps {
    children: React.ReactNode;
    cardTitle: string;
    cardDescription: string;
    extra?: React.ReactNode;
}


function AuthLayout({ children, cardTitle, cardDescription, extra }: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen md:bg-primary-6">
            <div className="pt-12 md:pt-24">

                <div className="px-6 max-w-md w-full text-center mx-auto md:flex md:justify-center">
                    <Logo />
                </div>

                <div className="relative z-[1] max-w-md w-full mx-auto">
                    <Card className="w-full mx-auto mt-6 md:mt-12 border-0 shadow-none md:border md:shadow-sm">
                        <CardHeader className="md:text-center">
                            <CardTitle className="font-bold text-2xl text-primary-6">{cardTitle}</CardTitle>
                            <CardDescription>{cardDescription}</CardDescription>
                        </CardHeader>
                        <CardContent>{children}</CardContent>
                    </Card>
                </div>

                {extra && <div className="mt-4 max-w-md w-full mx-auto">{extra}</div>}
            </div>
        </div>
    );
}

export default AuthLayout;
