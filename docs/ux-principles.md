# UI/UX Design Principles

## Visual Identity: "Digital Zen"
The interface balances the futuristic aesthetic of a "second brain" with the calm required for deep work.
- **Aesthetic:** Cyberpunk-lite / Glassmorphism.
- **Palette:** Dark mode native. Uses deep Zinc backgrounds (`bg-zinc-950`) with subtle Indigo glows (`shadow-indigo-500/20`) to signify active elements without causing eye strain.

## Interaction Design (IxD)

### 1. Reducing Friction (The "Capture" Principle)
The most critical metric for a note-taking app is *time-to-capture*.
- **Modal Inputs:** The "Capture Idea" form opens in a modal (overlay), preventing context switching. The user doesn't leave their current view to write.
- **Auto-Categorization:** Type and Tag selections are prominent to encourage organization at the point of entry.

### 2. Motion as Feedback
We use **Framer Motion** not just for decoration, but to communicate system state.
- **Staggered Entrance:** Notes load in a cascaded sequence (`staggerChildren: 0.1`). This makes the data feel "alive" and organic rather than a static spreadsheet.
- **Layout Animations:** When filtering (e.g., clicking "INSIGHTS"), the grid seamlessly rearranges items (`layout` prop) rather than snapping, helping the user track where items went.

### 3. Information Architecture
- **Masonry-style Grid:** Notes are displayed in a responsive grid that adapts to content length. This mimics a corkboard or sticky-note wall, allowing for non-linear scanning of ideas.
- **Visual Taxonomy:**
  - **Badges:** Color-coded icons (Link vs. Insight) allow users to distinguish content types at a glance.
  - **Typography:** Titles are bold and prominent; the AI summary is lighter, serving as a subheading to the raw content.