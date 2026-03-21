export default function ImagesTest() {
  return (
    <div>
      <h2>Product Gallery</h2>

      <div className="grid grid-cols-2 gap-4 my-4">
        {/* ERROR: Missing alt attribute entirely */}
        <div>
          <img src="https://picsum.photos/seed/product1/400/300" width={400} height={300} />
          <p>Our flagship product in use.</p>
        </div>

        {/* ERROR: Suspicious alt text pattern */}
        <div>
          <img
            src="https://picsum.photos/seed/product2/400/300"
            alt="image.jpg"
            width={400}
            height={300}
          />
          <p>Another view of the product.</p>
        </div>

        {/* ERROR: Suspicious alt text — generic */}
        <div>
          <img
            src="https://picsum.photos/seed/product3/400/300"
            alt="photo"
            width={400}
            height={300}
          />
          <p>Lifestyle photo.</p>
        </div>

        {/* ERROR: Very long alt text (>150 characters) */}
        <div>
          <img
            src="https://picsum.photos/seed/product4/400/300"
            alt="This is an extremely detailed description of a product image showing a person using the product in their daily life while sitting at a desk in a modern office environment with natural lighting coming through large windows and plants in the background creating a pleasant atmosphere"
            width={400}
            height={300}
          />
          <p>Office setting product shot.</p>
        </div>

        {/* ERROR: Decorative image without alt="" (has role="presentation" but no alt) */}
        <div>
          <img src="https://picsum.photos/seed/decorative/400/100" width={400} height={100} />
          <p>Decorative divider.</p>
        </div>

        {/* CORRECT: Proper alt text */}
        <div>
          <img
            src="https://picsum.photos/seed/correct/400/300"
            alt="Team members collaborating around a whiteboard during a design sprint"
            width={400}
            height={300}
          />
          <p>Our team at work.</p>
        </div>

        {/* CORRECT: Decorative image with empty alt */}
        <div>
          <img src="https://picsum.photos/seed/decorative2/400/50" alt="" width={400} height={50} />
          <p>Decorative separator.</p>
        </div>
      </div>
    </div>
  );
}
