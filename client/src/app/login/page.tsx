'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';


export default function Home() {
  const router = useRouter();

  // useEffect to trigger redirection
  // useEffect(() => {
  //   // Redirect to the specified route after 3 second
  //     router.push('/login'); // Change '/other-route' to the route 
  // }, []);

  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
  }
  return (
    <main className="flex min-h-screen items-center justify-between">
      <div className="border h-full min-h-screen w-[60%] bg-login-img bg-no-repeat	
        flex justify-start items-start text-5xl font-bold text-white p-20">
        Pnacademy
      </div>
      <div className="w-[40%] h-full p-10 flex justify-center items-center">
        <Card className="max-w-[350px]">
          <CardHeader className="font-semibold justify-center items-center  text-2xl">
            Login
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent>
              <Input className="mt-4" type="text" placeholder="Username" />
              <Input className="mt-4" type="password" placeholder="Password" />
            </CardContent>
            <CardFooter>
              <Button className="mt-4 w-full" type="submit" variant={"default"}>
                Login
              </Button>
            </CardFooter>
          </form>
        </Card>

      </div>
    </main>
  );
}
