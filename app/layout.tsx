import type {Metadata} from "next";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import {AuthProvider} from "@/contexts/auth-context";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
    title: "MedFund - Medical Crowdfunding Platform",
    description: "Help fund medical treatments for those in need",
    generator: "v0.dev",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
                <QueryProvider>
                    {children}
                </QueryProvider>
            </AuthProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
