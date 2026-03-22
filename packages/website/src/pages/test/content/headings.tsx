export default function HeadingsTest() {
  return (
    <article>
      {/* ERROR: Multiple h1 elements */}
      <h1>Welcome to Our Blog</h1>
      <p>This is the main blog page with articles about web development.</p>

      {/* ERROR: Skipped heading level h2 → h4 */}
      <h4>Latest Articles</h4>
      <p>Here are some of our most recent posts about frontend development.</p>

      <section>
        <h2>Understanding React Hooks</h2>
        <p>
          React Hooks were introduced in React 16.8 and have since become the standard way to manage
          state and side effects in functional components.
        </p>

        {/* ERROR: Empty heading */}
        <h3></h3>
        <p>
          The useState hook is the most basic hook that lets you add state to functional components.
        </p>

        <h3>useEffect Hook</h3>
        <p>
          The useEffect hook lets you perform side effects in function components, replacing
          lifecycle methods like componentDidMount.
        </p>
      </section>

      {/* ERROR: Second h1 */}
      <h1>More Content</h1>

      <section>
        {/* ERROR: Skipped level h2 → h5 */}
        <h5>Tips &amp; Tricks</h5>
        <p>Here are some tips for working with modern JavaScript frameworks.</p>

        {/* ERROR: Empty heading with only whitespace */}
        <h2> </h2>
        <p>This section was supposed to have a heading but it only contains spaces.</p>
      </section>

      {/* CORRECT: Proper heading hierarchy for comparison */}
      <section>
        <h2>Correct Heading Example</h2>
        <p>This section follows proper heading hierarchy.</p>
        <h3>Subsection A</h3>
        <p>Content under subsection A.</p>
        <h3>Subsection B</h3>
        <p>Content under subsection B.</p>
      </section>
    </article>
  );
}
