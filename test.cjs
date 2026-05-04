const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  try {
    await page.goto('http://localhost:5174/register');
    console.log('Navigated to register');
    
    // Check initial userType
    const isTenantActive = await page.evaluate(() => document.querySelector('button:has-text("أنا مستأجر")').className.includes('bg-['));
    console.log('Is tenant active initially:', isTenantActive);

    await page.click('button:has-text("أنا مؤجر")');
    console.log('Clicked owner toggle');
    
    // Fill form by standard indices or generic selectors to avoid Arabic encoding issues if any
    const inputs = await page.$$('input[type="text"], input[type="password"], input[type="tel"], input[type="email"]');
    // Name
    await inputs[0].fill('Test Owner');
    // Phone
    await inputs[1].fill('733000000');
    // Email
    await inputs[2].fill('test@test.com');
    // Password
    await inputs[3].fill('password123');
    // Confirm Password
    await inputs[4].fill('password123');
    
    // Fill owner specific fields (Store name etc)
    // Selectors by index might be brittle, let's use the labels if possible.
    // However, after selecting owner, more inputs appear. Let's re-query inputs.
    const allInputs = await page.$$('input[type="text"], input[type="password"], input[type="tel"], input[type="email"]');
    // Index 5 is Store Name
    await allInputs[5].fill('Test Store');
    
    // Selects
    const selects = await page.$$('select');
    await selects[0].selectOption({ index: 1 }); // Governorate
    await selects[1].selectOption({ index: 1 }); // District
    await selects[2].selectOption({ index: 1 }); // Main Governorate
    await selects[3].selectOption({ index: 1 }); // Payment Method
    
    // Check terms
    await page.click('input[type="checkbox"]');
    console.log('Checked terms');
    
    await page.click('button[type="submit"]');
    console.log('Clicked submit');
    
    await page.waitForTimeout(2000);
    console.log('Final URL:', page.url());
    
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 500));
    console.log('Body Text:', bodyText);
  } catch (err) {
    console.log('TEST SCRIPT ERROR:', err);
  }
  
  await browser.close();
})();
