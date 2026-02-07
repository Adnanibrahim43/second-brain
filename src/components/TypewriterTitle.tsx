"use client";

import Typewriter from "typewriter-effect";

export default function TypewriterTitle() {
  return (
    <div className="text-muted-foreground font-semibold">
      <Typewriter
        options={{
          loop: true,
          delay: 50, // Speed of typing
          deleteSpeed: 30, // Speed of deleting
        }}
        onInit={(typewriter) => {
          typewriter
            .typeString("Your AI-powered external memory.")
            .pauseFor(2000) // Wait 2 seconds
            .deleteAll()
            .typeString("Capture ideas instantly.")
            .pauseFor(2000)
            .deleteAll()
            .typeString("Organize your life with AI.")
            .pauseFor(2000)
            .start();
        }}
      />
    </div>
  );
}