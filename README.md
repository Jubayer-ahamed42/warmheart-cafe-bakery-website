# ☕ WarmHeart Cafe & Bakery — Official Commercial Website

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Live Demo: Cloudflare](https://img.shields.io/badge/Live_Website-Cloudflare_Edge-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://warmheart-cafe-bakery-website.sbmc4042.workers.dev)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile--Responsive-success?style=flat-square)](#)
[![Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-amber?style=flat-square)](#)
[![Architecture](https://img.shields.io/badge/Architecture-Single--Page%20Scrollspy-orange?style=flat-square)](#)

> **Official Commercial Website for Artisanal Specialty Coffee & Handcrafted Bakery**  
> Engineered by **Jubayer Ahamed** | Founder & AI Solutions Architect at **Be Smart With AI**.  
> 🌐 **Live Website URL:** [https://warmheart-cafe-bakery-website.sbmc4042.workers.dev](https://warmheart-cafe-bakery-website.sbmc4042.workers.dev)

---

## 📖 Executive Overview

**WarmHeart Cafe and Bakery** is a modern, high-conversion commercial website built for boutique specialty cafes and artisanal bakeries. Designed with warm hospitality aesthetics, mobile-first responsiveness, and smooth interactive navigation, the platform transforms casual online visitors into engaged dine-in and takeaway customers.

The system features seamless single-page navigation with active scrollspy tracking, structured menu categorization, interactive photo galleries with modal inspection, leadership showcase, and an integrated reservation and inquiry system.

---

## 🌟 Key Architecture & Features

### 1. 🎯 Seamless Single-Page Architecture & Scrollspy
* **Frictionless Browsing**: Seamless 5-section unified layout (`#home`, `#about`, `#menu`, `#gallery`, `#contact`) eliminating page reloads.
* **Intelligent Scrollspy**: Real-time IntersectionObserver tracking that dynamically highlights active navigation links with 80px sticky-header compensation.
* **Adaptive Mobile Navigation**: Touch-friendly hamburger drawer navigation with automatic closure on anchor selection.

### 2. 📋 Visual Menu & Categorization
* Categorized presentation of **Specialty Brews** (Espresso, Pour-over, Cold Brew, Signature Lattes) and **Fresh Daily Pastries** (Croissants, Sourdough, Artisan Tarts, Cinnamon Brioches).
* Dietary and pricing badges with clear item descriptions.

### 3. 🖼️ Artisanal Bakery Gallery
* High-definition grid showcasing freshly baked batches, baristas in action, and cozy cafe interiors.
* Lightbox zoom capabilities with zero external library overhead.

### 4. 👥 Heritage & Team Leadership Showcase
* Dedicated team section highlighting culinary craftsmanship:
  * **Jubair Ahmad** — Founder & Head Roaster
  * **Ashraf** — Head Pastry Chef
  * **Imran** — Cafe Manager & Hospitality Lead
* 1:1 circular responsive portraits optimized for ultra-fast CDN delivery.

### 5. 📍 Reservation & Contact Integration
* Interactive contact form with real-time client-side validation and inline confirmation messages.
* Operating hours, address, direct telephone, and responsive embedded map.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Structure** | Semantic HTML5, Microdata & Open Graph Meta Tags |
| **Styling** | Modern CSS3 (CSS Grid, Flexbox, Custom Properties, Smooth Scrolling) |
| **Interactivity** | Vanilla JavaScript (ES6+), DOM APIs, IntersectionObserver |
| **Testing** | Headless Chrome CDP Automation (`tests/run_tests.py`), Static DOM Linters |
| **Tooling & Deploy**| Cloudflare Edge CDN (Workers & Static Assets), Vite, 1-Click Launchers |

---

## 🚀 Quickstart & Local Development

### Option 1: 1-Click Windows Launcher (Recommended)
Simply double-click the included Windows launcher:
```cmd
run_website.bat
```
* **[1]** Open directly in default browser (`index.html`)
* **[2]** Start fast local Python HTTP server on port 3000
* **[3]** Run with Vite development server (`npm run dev`)

### Option 2: Python HTTP Server
```bash
python -m http.server 3000
```
Visit: `http://localhost:3000/`

---

## 🧪 Automated Testing & Quality Assurance

Run the comprehensive automated test suite (including real Headless Chrome CDP browser validations):
```bash
python tests/run_tests.py
```
* ✅ Static DOM, section IDs, and anchor link checks
* ✅ Team member asset resolution & 1:1 aspect ratio verification
* ✅ Smooth scroll, scroll-padding offset, and sticky header validation
* ✅ Real browser scrollspy, mobile menu toggle, and form submission

---

## 📄 License & Attribution

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full details.  
Architected with ❤️ by **[Jubayer Ahamed](https://github.com/Jubayer-ahamed42)** | **[Be Smart With AI](https://jubayer-ahamed.vercel.app)**.
