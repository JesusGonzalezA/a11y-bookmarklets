export default function LandmarksTest() {
  return (
    <>
      {/* ERROR: Content outside any landmark */}
      <p>This paragraph is outside any landmark region and will be flagged.</p>

      {/* ERROR: Duplicate nav elements without accessible names */}
      <nav>
        <ul>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>

      <nav>
        <ul>
          <li>
            <a href="#prev">Previous</a>
          </li>
          <li>
            <a href="#next">Next</a>
          </li>
        </ul>
      </nav>

      {/* ERROR: Multiple aside elements without labels */}
      <aside>
        <h3>Related Articles</h3>
        <p>Here are some articles you might enjoy.</p>
      </aside>

      <aside>
        <h3>Advertisements</h3>
        <p>Premium subscription available now.</p>
      </aside>

      {/* ERROR: Using div instead of semantic landmarks */}
      <div className="header-area">
        <h1>Company Name</h1>
        <p>Making the web accessible, one page at a time.</p>
      </div>

      <div className="main-content">
        <h2>Our Services</h2>
        <p>
          We offer a wide range of accessibility consulting services for businesses of all sizes.
        </p>

        <div className="sidebar">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="#audits">Audits</a>
            </li>
            <li>
              <a href="#training">Training</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-area">
        <p>&copy; 2026 Company Name. All rights reserved.</p>
      </div>

      {/* CORRECT: Proper landmark usage */}
      <section aria-label="Correct landmark example">
        <header>
          <h2>Properly Structured Section</h2>
        </header>
        <main>
          <p>This main content is inside a proper landmark.</p>
        </main>
        <nav aria-label="Footer navigation">
          <ul>
            <li>
              <a href="#privacy">Privacy</a>
            </li>
            <li>
              <a href="#terms">Terms</a>
            </li>
          </ul>
        </nav>
        <footer>
          <p>Section footer with correct landmark.</p>
        </footer>
      </section>
    </>
  );
}
