import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CookShelf',
  description: 'CookShelf helps you turn your shopping list into delicious meals by suggesting recipes based on your available ingredients. Simplify meal planning and reduce waste with smart cooking suggestions tailored to what you have in your pantry.',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <main className="min-h-screen bg-background font-sans antialiased">
            <header className="p-4 bg-white shadow-md">
              <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">CookShelf</h1>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </header>
            <div className="container mx-auto p-4">
              {children}
            </div>
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
