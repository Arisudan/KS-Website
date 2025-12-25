# KS Drives Website - User Guide

## Overview
This website is designed to be **100% editable** directly from the browser. You do not need to write code to change text, images, or contact details.

## How to Edit Content

1. **Enter Edit Mode**
   - Look for the **"Edit Mode"** button at the bottom-right corner of the screen.
   - Click it.
   - Enter the admin password: `admin` (This is a default for demonstration).

2. **Editing Text**
   - Once in Edit Mode, you will see dashed blue outlines around editable text areas (titles, descriptions, addresses, etc.).
   - Simply **click on the text** you want to change.
   - It will turn into an input box. Type your changes.
   - Click outside the box (blur) or press Enter (for single lines) to save. The change is applied instantly.

3. **Editing Images**
   - Hover over images (like the Hero background or Product images).
   - If editable, a dark overlay with a **"Change"** button will appear.
   - Click it to upload a new image from your computer.

4. **Managing Products**
   - Navigate to the **Products** page.
   - In Edit Mode, you will see an **"+ Add Product"** button next to category titles.
   - You can also delete products using the trash icon on the product card image.

5. **Saving Changes**
   - All changes are saved to your browser's local storage automatically.
   - To make changes **permanent** for a live deployment updates:
     1. Click the **"Save Changes"** (floppy disk icon) button at the bottom right to ensure everything is synced.
     2. Click the green **Download Config** button (Cloud Download icon).
     3. This will download a `site_content.json` file.
     4. Send this file to your developer or replace the content within `js/data.js` (requires one small code update to replace the `defaultContent` variable).

## Visual Ordering
- Currently, ordering is fixed by the template, but you can request specific re-ordering sections in future updates.

## Deployment
- To publish the site, simply upload the entire folder to any static hosting provider like **Netlify**, **Vercel**, or **GitHub Pages**.
- Ensure the `index.html` is the entry point.
- **Note**: Since this is a static site without a backend database, changes made by visitors are NOT saved globally. Only *you* can see your changes until you update the code/file as described in step 5.
