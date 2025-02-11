import Link from "next/link"

export default function Mission() {
  return (
    <div className="container">
      <header>
        <h1>VFS Incinerator</h1>
      </header>
      <main>
        <h2>Our Mission</h2>
        <div className="mission-text">
          <p>
            The VFS Incinerator is an application on the vebetterDAO. Users can burn the weekly selected NFT collections
            for a return of $B3TR token. From 2021 to the present, hundreds of thousands of NFTs have been created and
            distributed across the blockchain. Many of these projects and their founders have abandoned their
            communities, leaving the user's assets completely illiquid and virtually worthless.
          </p>
          <p>
            These communities are made up of the very fabric that is "vefam". Not only will the Incinerator give these
            users a "way out" but it will create hundreds of thousands of meaningful and sustainable events along the
            way.
          </p>
          <p>
            Thank you for showing interest in the VFS Incinerator, and please support our application if you find our
            initiative to be sustainable and healthy for the vechain ecosystem.
          </p>
        </div>
        <Link href="/" className="button">
          <span>Back to Home</span>
        </Link>
      </main>
      <footer>
        <p>&copy; 2025 VFS Incinerator. All rights reserved.</p>
      </footer>
    </div>
  )
}

