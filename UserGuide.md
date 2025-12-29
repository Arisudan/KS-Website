# KS Drives Website - User Guide v2.0
(Updated Dec 2025)

## 🚀 New Features & Upgrades
The website has been upgraded to a **Premium Enterprise Standard**.
1. **Dynamic Hero Slider**: Auto-rotating home banner.
2. **Scroll Animations**: Elements fade/slide in as you scroll.
3. **Live Stats**: Animated counters for "Years Experience", "Projects", etc.
4. **Product "Quick View" Modals**: Click any product for a detailed popup.
5. **Sticky Navigation**: Product category headers stick to the top while scrolling.
6. **SEO Editor**: Control your Google search appearance.
7. **WhatsApp Widget**: Floating chat button for instant leads.

---

## 🔐 Admin Access
There are two ways to enter **Edit Mode**:
1. **The Button**: Click "Edit Mode" at the bottom-right.
2. **The Pro Shortcut**: Press `Ctrl` + `Shift` + `/` (?) anywhere on the site.

**Default Password**: `admin`

---

## 🛠️ How to Manage Content

### 1. Basics (Text & Images)
- **Text**: Blue dashed lines appear around editable text. Click > Type > Enter.
- **Images**: Hover over any image (Banner, Product, Highlights). Click "Change" to upload new files.

### 2. SEO & Visitor Stats (NEW)
1. Go to **Admin Dashboard**.
2. Scroll to **SEO Settings**.
3. Edit the **Page Title** and **Description** for Home/Products. This updates what Google says about you.
4. Check **Daily Visitors** count at the top of the dashboard.

### 3. Managing Products
- **Add**: Click `+ Add Product` in any category on the Products page.
- **Delete**: Hover over a product image and click the red "Trash" icon.
- **Reorder**: Use the small arrows (Up/Down) to change product positions.
- **Details**: Clicking a product now opens a **popup**. The "Request Quote" button in the popup links to your contact form.

### 4. WhatsApp Integration
- The green button in the bottom-right uses the phone number listed in your **Footer** or **Contact Page**.
- Change the phone number in Edit Mode -> The WhatsApp button updates automatically!

---

## ⚠️ Troubleshooting

**"My Home Page is Blank / White!"**
If the site looks empty, your local data might be corrupted or outdated.
1. Open the browser console (F12).
2. Type: `localStorage.clear()` and hit Enter.
3. Refresh the page. This resets the site to the latest default content.

**"Changes aren't Saving?"**
- Remember: Changes are saved to **your browser** instantly.
- To make them public for everyone, you must **Download Config** (Green Cloud Button) and send the file to your developer to update the server.

---

## 📦 Deployment
- Upload the entire folder to **Netlify**, **Vercel**, or **GitHub Pages**.
- No database required. Everything runs in the browser.
