# Dashboard design images (Figma)

Images for the Dashboard right column come from the Figma design:

- **Figma file:** [Dashboard – 4.0](https://www.figma.com/design/rrUjhUkUxUEYx3WIHP6ezc/Dashboard--4.0-?)
- **Node:** 1243-30195 (Dashboard content)

## Sections that use images

1. **Latest from Circle** – 3 card images (orientation session, September release, strategies).
2. **Make the most of Circle** – Circle Plus hero image, Circle Connect hero image.
3. **What's trending** – Avatar images for engagement cards and “Top engagers” list.

## Current usage

The app uses existing project assets:

- **Latest from Circle:** ` /images/placeholders/image-1.png`, `image-2.png`, `image-3.png`
- **Make the most of Circle:** ` /images/placeholders/image.png`, `image-2.png`
- **Avatars:** ` /images/avatars/1.png` … `8.png`

To match the Figma design exactly, export the images from the Figma file (right‑click → Export) and save them into this folder (or replace the placeholders/avatars above). Then update the image paths in `src/components/Dashboard/Dashboard.tsx` to point to ` /images/dashboard/` (or the chosen paths).
