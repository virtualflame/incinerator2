"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div className="container">
      <header>
        <h1>VFS Incinerator</h1>
      </header>
      <main>
        <div className="button-container">
          <Link href="#" className="button flame-button">
            <span>Burn Now</span>
          </Link>
          <Link href="/mission" className="button">
            <span>Mission</span>
          </Link>
          <Link href="#" className="button">
            <span>Vote</span>
          </Link>
          <Link href="#" className="button">
            <span>Contact</span>
          </Link>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 VFS Incinerator. All rights reserved.</p>
      </footer>
    </div>
  )
}

