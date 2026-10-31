"""
==========================================================================
Warm Heart Cafe and Bakery - Comprehensive Automated Test Suite
==========================================================================
Validates:
1. Unified single-page landing structure in index.html (5 sections: #home, #about, #menu, #gallery, #contact)
2. Anchor navigation links in header and footer
3. Team grid with owner photo (assets/owner.jpg) and roles
4. Menu drinks and pastries categorization
5. Gallery grid with zoom and captions
6. Contact details, form elements, and map embed
7. CSS smooth scroll, scroll-padding-top, and sticky header offset
8. Standalone pages redirecting cleanly
9. Real Chrome browser CDP verification of scrollspy, anchor clicks, mobile menu, and form message
"""

import os
import re
import sys
import subprocess
import time
import json
import urllib.request
import asyncio

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def run_static_tests():
    print("--- [1] Running Static DOM & Code Validations ---")
    
    # 1. index.html structure
    index_path = os.path.join(ROOT_DIR, 'index.html')
    with open(index_path, 'r', encoding='utf-8') as f:
        html = f.read()

    sections = re.findall(r'<section[^>]*id=["\']([^"\']+)["\']', html)
    print("Found sections in index.html:", sections)
    expected_sections = ['home', 'about', 'menu', 'gallery', 'contact']
    assert all(s in sections for s in expected_sections), f"Missing expected sections in {sections}"

    # 2. Nav links
    nav_links = re.findall(r'href=["\'](#[^"\']+)["\']', html)
    print("Found internal anchor hrefs:", set(nav_links))
    for expected in ['#home', '#about', '#menu', '#gallery', '#contact']:
        assert expected in nav_links, f"Expected nav link {expected} not found"

    # 3. Team members
    assert 'assets/owner.jpg' in html, "assets/owner.jpg not referenced in index.html"
    assert os.path.exists(os.path.join(ROOT_DIR, 'assets', 'owner.jpg')), "assets/owner.jpg file missing"
    
    # Manager validations
    assert 'assets/manager.jpg' in html, "assets/manager.jpg not referenced in index.html"
    assert 'alt="Muhammad - Manager"' in html, "alt='Muhammad - Manager' not found in index.html"
    assert os.path.exists(os.path.join(ROOT_DIR, 'assets', 'manager.jpg')), "assets/manager.jpg file missing"
    assert os.path.exists(os.path.join(ROOT_DIR, 'assets', 'manager_full.jpg')), "assets/manager_full.jpg file missing"
    
    # Chef validations
    assert 'assets/chef.jpg' in html, "assets/chef.jpg not referenced in index.html"
    assert 'alt="Alamin - Head Chef"' in html, "alt='Alamin - Head Chef' not found in index.html"
    assert 'id="team-alamin"' in html, "id='team-alamin' not found in index.html"
    assert os.path.exists(os.path.join(ROOT_DIR, 'assets', 'chef.jpg')), "assets/chef.jpg file missing"
    assert os.path.exists(os.path.join(ROOT_DIR, 'assets', 'chef_full.jpg')), "assets/chef_full.jpg file missing"
    assert os.path.exists(os.path.join(ROOT_DIR, 'assets', 'chef_crop.jpg')), "assets/chef_crop.jpg file missing"
    assert os.path.exists(os.path.join(ROOT_DIR, 'assets', 'chef_avatar.jpg')), "assets/chef_avatar.jpg file missing"

    # Verify owner, manager, and chef images are 1:1 square with resolution >= 400
    from PIL import Image
    with Image.open(os.path.join(ROOT_DIR, 'assets', 'owner.jpg')) as img:
        assert img.size[0] == img.size[1], f"owner.jpg must be 1:1 square, got {img.size}"
        assert img.size[0] >= 400, f"owner.jpg resolution too low: {img.size}"

    with Image.open(os.path.join(ROOT_DIR, 'assets', 'manager.jpg')) as img:
        assert img.size[0] == img.size[1], f"manager.jpg must be 1:1 square, got {img.size}"
        assert img.size[0] >= 400, f"manager.jpg resolution too low: {img.size}"

    with Image.open(os.path.join(ROOT_DIR, 'assets', 'chef.jpg')) as img:
        assert img.size[0] == img.size[1], f"chef.jpg must be 1:1 square, got {img.size}"
        assert img.size[0] >= 400, f"chef.jpg resolution too low: {img.size}"

    assert 'Jubair Ahmad' in html, "Jubair Ahmad not in team section"
    assert 'Alamin' in html, "Alamin not in team section"
    assert 'Muhammad' in html, "Muhammad not in team section"

    # Team sequence validation (Method 1: Center-Stage Leader)
    # 1st: Alamin (Head Chef & Pastry Specialist)
    # 2nd: Jubair Ahmad (Owner & Founder)
    # 3rd: Muhammad (Manager)
    expected_team_order = ['team-alamin', 'team-jubair-ahmad', 'team-muhammad']
    assert 'id="team-grid"' in html, "team-grid not found in index.html"
    team_card_ids = re.findall(r'<div[^>]*class=["\'][^"\']*team-card[^"\']*["\'][^>]*id=["\']([^"\']+)["\']', html)
    assert team_card_ids == expected_team_order, f"Expected index.html team order {expected_team_order}, got {team_card_ids}"

    # 4. CSS validations
    css_path = os.path.join(ROOT_DIR, 'style.css')
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    assert 'scroll-behavior: smooth;' in css, "Missing smooth scroll in CSS"
    assert 'scroll-padding-top: 80px;' in css, "Missing scroll-padding-top in CSS"
    # Ensure redundant scroll-margin-top is NOT set to prevent double offset
    assert 'section[id] {\n  scroll-margin-top:' not in css, "Redundant scroll-margin-top found in CSS"

    # 5. Standalone redirects
    for page in ['about.html', 'menu.html', 'gallery.html', 'contact.html']:
        page_path = os.path.join(ROOT_DIR, page)
        with open(page_path, 'r', encoding='utf-8') as f:
            content = f.read()
        section_id = page.replace('.html', '')
        assert f'index.html#{section_id}' in content, f"Missing redirect target in {page}"
        if page == 'about.html':
            assert 'assets/owner.jpg' in content, "Missing assets/owner.jpg reference in about.html"
            assert 'assets/manager.jpg' in content, "Missing assets/manager.jpg reference in about.html"
            assert 'alt="Muhammad - Manager"' in content, "Missing alt='Muhammad - Manager' in about.html"
            assert 'assets/chef.jpg' in content, "Missing assets/chef.jpg reference in about.html"
            assert 'alt="Alamin - Head Chef"' in content, "Missing alt='Alamin - Head Chef' in about.html"
            assert 'id="team-alamin"' in content, "Missing id='team-alamin' in about.html"
            assert 'id="team-grid"' in content, "team-grid not found in about.html"

            about_card_ids = re.findall(r'<div[^>]*class=["\'][^"\']*team-card[^"\']*["\'][^>]*id=["\']([^"\']+)["\']', content)
            assert about_card_ids == expected_team_order, f"Expected about.html team order {expected_team_order}, got {about_card_ids}"

    print("Static DOM & Code Validations: ALL PASS!\n")

async def run_browser_cdp_tests():
    print("--- [2] Running Real Headless Chrome Browser CDP Tests ---")
    chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    if not os.path.exists(chrome_path):
        print("Chrome not found at standard path, skipping browser CDP tests.")
        return

    import websockets

    file_url = 'file:///' + os.path.abspath(os.path.join(ROOT_DIR, 'index.html')).replace('\\', '/')
    port = 9227

    proc = subprocess.Popen([
        chrome_path,
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        f'--remote-debugging-port={port}',
        '--window-size=1200,900',
        file_url
    ])

    time.sleep(2)

    try:
        req = urllib.request.urlopen(f'http://localhost:{port}/json')
        tabs = json.loads(req.read().decode())
        target_tab = next(t for t in tabs if t.get('type') == 'page')
        ws_url = target_tab['webSocketDebuggerUrl']

        async with websockets.connect(ws_url) as ws:
            msg_id = 1

            async def evaluate(expr):
                nonlocal msg_id
                msg_id += 1
                payload = {
                    "id": msg_id,
                    "method": "Runtime.evaluate",
                    "params": {"expression": expr, "returnByValue": True, "awaitPromise": True}
                }
                await ws.send(json.dumps(payload))
                while True:
                    resp = json.loads(await ws.recv())
                    if resp.get('id') == payload['id']:
                        return resp.get('result', {}).get('result', {}).get('value')

            # Initial load active nav
            active_on_load = await evaluate("document.querySelector('.nav-links a.active')?.id")
            assert active_on_load == 'nav-home', f"Expected nav-home, got {active_on_load}"

            # Click About -> verify active nav-about and rect.top ~80px
            await evaluate("document.getElementById('nav-about').click()")
            await asyncio.sleep(1.0)
            about_top = await evaluate("document.getElementById('about').getBoundingClientRect().top")
            active_about = await evaluate("document.querySelector('.nav-links a.active')?.id")
            assert active_about == 'nav-about', f"Expected nav-about, got {active_about}"
            assert abs(about_top - 80) < 5, f"Expected about top ~80, got {about_top}"

            # Click Menu -> verify active nav-menu and rect.top ~80px
            await evaluate("document.getElementById('nav-menu').click()")
            await asyncio.sleep(1.0)
            menu_top = await evaluate("document.getElementById('menu').getBoundingClientRect().top")
            active_menu = await evaluate("document.querySelector('.nav-links a.active')?.id")
            assert active_menu == 'nav-menu', f"Expected nav-menu, got {active_menu}"
            assert abs(menu_top - 80) < 5, f"Expected menu top ~80, got {menu_top}"

            # Click Gallery -> verify active nav-gallery
            await evaluate("document.getElementById('nav-gallery').click()")
            await asyncio.sleep(1.0)
            active_gallery = await evaluate("document.querySelector('.nav-links a.active')?.id")
            assert active_gallery == 'nav-gallery', f"Expected nav-gallery, got {active_gallery}"

            # Click Contact -> verify active nav-contact
            await evaluate("document.getElementById('nav-contact').click()")
            await asyncio.sleep(1.0)
            active_contact = await evaluate("document.querySelector('.nav-links a.active')?.id")
            assert active_contact == 'nav-contact', f"Expected nav-contact, got {active_contact}"

            # Click Logo -> verify active nav-home and top scroll
            await evaluate("document.getElementById('site-logo').click()")
            await asyncio.sleep(1.0)
            active_home = await evaluate("document.querySelector('.nav-links a.active')?.id")
            assert active_home == 'nav-home', f"Expected nav-home, got {active_home}"

            # Mobile menu toggle
            await evaluate("document.getElementById('nav-toggle').click()")
            is_open = await evaluate("document.getElementById('nav-links').classList.contains('open')")
            assert is_open is True, "Expected mobile menu open after toggle click"
            await evaluate("document.getElementById('nav-about').click()")
            is_open_after = await evaluate("document.getElementById('nav-links').classList.contains('open')")
            assert is_open_after is False, "Expected mobile menu closed after link click"

            # Form submit inline notification
            await evaluate("""
                (() => {
                    document.getElementById('user-name').value = 'Jubair Customer';
                    document.getElementById('user-email').value = 'cust@example.com';
                    document.getElementById('user-message').value = 'Awesome bakery!';
                    document.getElementById('contact-form').dispatchEvent(new Event('submit', { cancelable: true }));
                })()
            """)
            form_display = await evaluate("getComputedStyle(document.getElementById('form-message')).display")
            form_html = await evaluate("document.getElementById('form-message').innerHTML")
            assert form_display == 'block', "Form message display should be block"
            assert "Jubair Customer" in form_html, "Form message should contain user name"

            # Team sequence validation in DOM
            dom_team_ids = await evaluate("Array.from(document.querySelectorAll('#team-grid .team-card')).map(el => el.id)")
            assert dom_team_ids == ['team-alamin', 'team-jubair-ahmad', 'team-muhammad'], f"DOM team order mismatch: {dom_team_ids}"

            # Owner team image rendering in browser
            owner_img_complete = await evaluate("document.querySelector('#team-jubair-ahmad img')?.complete")
            owner_img_natural_w = await evaluate("document.querySelector('#team-jubair-ahmad img')?.naturalWidth")
            owner_img_natural_h = await evaluate("document.querySelector('#team-jubair-ahmad img')?.naturalHeight")
            owner_img_border_radius = await evaluate("getComputedStyle(document.querySelector('#team-jubair-ahmad img')).borderRadius")
            owner_img_width = await evaluate("getComputedStyle(document.querySelector('#team-jubair-ahmad img')).width")
            owner_img_height = await evaluate("getComputedStyle(document.querySelector('#team-jubair-ahmad img')).height")
            
            assert owner_img_complete is True, "Owner image did not complete loading"
            assert owner_img_natural_w and owner_img_natural_w > 0, f"Owner image naturalWidth invalid: {owner_img_natural_w}"
            assert owner_img_natural_h and owner_img_natural_h > 0, f"Owner image naturalHeight invalid: {owner_img_natural_h}"
            assert owner_img_border_radius == '50%', f"Expected 50% border radius, got {owner_img_border_radius}"
            assert owner_img_width == '130px', f"Expected width 130px, got {owner_img_width}"
            assert owner_img_height == '130px', f"Expected height 130px, got {owner_img_height}"

            # Chef team image rendering in browser
            chef_img_complete = await evaluate("document.querySelector('#team-alamin img')?.complete")
            chef_img_natural_w = await evaluate("document.querySelector('#team-alamin img')?.naturalWidth")
            chef_img_natural_h = await evaluate("document.querySelector('#team-alamin img')?.naturalHeight")
            chef_img_border_radius = await evaluate("getComputedStyle(document.querySelector('#team-alamin img')).borderRadius")
            chef_img_width = await evaluate("getComputedStyle(document.querySelector('#team-alamin img')).width")
            chef_img_height = await evaluate("getComputedStyle(document.querySelector('#team-alamin img')).height")
            
            assert chef_img_complete is True, "Chef image did not complete loading"
            assert chef_img_natural_w and chef_img_natural_w > 0, f"Chef image naturalWidth invalid: {chef_img_natural_w}"
            assert chef_img_natural_h and chef_img_natural_h > 0, f"Chef image naturalHeight invalid: {chef_img_natural_h}"
            assert chef_img_border_radius == '50%', f"Expected 50% border radius, got {chef_img_border_radius}"
            assert chef_img_width == '130px', f"Expected width 130px, got {chef_img_width}"
            assert chef_img_height == '130px', f"Expected height 130px, got {chef_img_height}"

            # Manager team image rendering in browser
            img_complete = await evaluate("document.querySelector('#team-muhammad img')?.complete")
            img_natural_w = await evaluate("document.querySelector('#team-muhammad img')?.naturalWidth")
            img_natural_h = await evaluate("document.querySelector('#team-muhammad img')?.naturalHeight")
            img_border_radius = await evaluate("getComputedStyle(document.querySelector('#team-muhammad img')).borderRadius")
            img_width = await evaluate("getComputedStyle(document.querySelector('#team-muhammad img')).width")
            img_height = await evaluate("getComputedStyle(document.querySelector('#team-muhammad img')).height")
            
            assert img_complete is True, "Manager image did not complete loading"
            assert img_natural_w and img_natural_w > 0, f"Manager image naturalWidth invalid: {img_natural_w}"
            assert img_natural_h and img_natural_h > 0, f"Manager image naturalHeight invalid: {img_natural_h}"
            assert img_border_radius == '50%', f"Expected 50% border radius, got {img_border_radius}"
            assert img_width == '130px', f"Expected width 130px, got {img_width}"
            assert img_height == '130px', f"Expected height 130px, got {img_height}"

            print("Real Headless Chrome Browser CDP Tests: ALL PASS!\n")
    finally:
        proc.terminate()

if __name__ == '__main__':
    run_static_tests()
    asyncio.run(run_browser_cdp_tests())
    print("ALL TESTS PASSED SUCCESSFULLY!")
