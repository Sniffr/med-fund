"use client";

import Link from "next/link";
import {Menu} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";

const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="container max-sm:px-4 mx-auto flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center">
                    <span className="text-xl font-bold">MedFund</span>
                </Link>
                <nav className="hidden md:flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="outline">Login</Button>
                    </Link>
                    <Link href="/register">
                        <Button>Register</Button>
                    </Link>
                </nav>
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="outline" size="icon">
                                <Menu className="h-5 w-5"/>
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="flex flex-col gap-4 mt-8">
                                <Link href="/login">
                                    <Button variant="outline" className="w-full justify-start">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="w-full justify-start">Register</Button>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
            </div>
        </header>
    );
};

export default Navbar;