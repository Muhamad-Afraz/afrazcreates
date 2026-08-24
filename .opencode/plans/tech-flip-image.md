# Tech Flip Image — Remaining Work

## Context
- User chose to use their uploaded animation image as the back face of the Technologies flip gate.
- Attachment couldn't be viewed (no image support); identified as `public/images/Animation back pic.png`.
- **Already done (before edit lock):** renamed `public/images/Animation back pic.png` → `public/images/tech-flip-back.png` (matches existing constant at `components/TechIntroGate.tsx:14`; avoids space-in-URL).
- `profile.jpg` stays untouched in `public/`.

## Steps
1. **Remove placeholder overlay text** in `FlipBackImage()` — `components/TechIntroGate.tsx:81-83`
   - Delete the div rendering `"drop image · public/images/tech-flip-back.png"`:
     ```tsx
     <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
       drop image · public{TECH_FLIP_IMAGE}
     </div>
     ```
   - Keep the `[transform:scaleX(-1)]` wrapper — it cancels the parent sheet's 180° `rotateY` so the image rests un-mirrored.
   - No constant/path change needed (`TECH_FLIP_IMAGE = "/images/tech-flip-back.png"` already correct).

2. **Verify**
   - `npm run dev`
   - Scroll through Technologies gate section (~330vh sticky region)
   - Confirm flip reveals image cleanly, no 404/broken-image flash
