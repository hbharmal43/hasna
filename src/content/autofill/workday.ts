import { UserProfile } from '../../types';

console.log("Workday autofill module loaded");

export function autofillWorkday(userData: UserProfile): void {
  console.log("Running Workday Autofill with data:", userData);
  console.log("Page document:", { 
    title: document.title,
    forms: document.forms.length,
    inputs: document.querySelectorAll('input').length,
    textareas: document.querySelectorAll('textarea').length,
    selects: document.querySelectorAll('select').length
  });

  const fillInput = (selector: string, value: string | undefined): boolean => {
    if (!value) {
      console.log(`No value provided for selector: ${selector}`);
      return false;
    }
    
    const el = document.querySelector(selector) as HTMLInputElement | null;
    if (el && value) {
      console.log(`Found element for selector: ${selector}`, el);
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      console.log(`Filled ${selector} with value: ${value}`);
      return true;
    } else {
      console.log(`Could not find element for selector: ${selector}`);
    }
    return false;
  };

  // Try to fill common input fields
  const inputAttempts = [
    // Name fields
    () => fillInput('input[name*="first"][name*="name" i]', userData.first_name),
    () => fillInput('input[name*="last"][name*="name" i]', userData.last_name),
    () => fillInput('input[name*="full"][name*="name" i]', userData.first_name && userData.last_name ? `${userData.first_name} ${userData.last_name}` : undefined),
    () => fillInput('input[name*="name" i]:not([type="file"])', userData.first_name && userData.last_name ? `${userData.first_name} ${userData.last_name}` : undefined),
    
    // Contact fields
    () => fillInput('input[name*="email" i], input[type="email"]', userData.email),
    () => fillInput('input[name*="phone" i], input[type="tel"]', userData.phone),
    
    // URL fields
    () => fillInput('input[name*="linkedin" i]', userData.linkedin_url),
    () => fillInput('input[name*="website" i], input[name*="portfolio" i]', userData.website_url),

    // Address fields
    () => fillInput('input[name*="address" i]', userData.address),
    () => fillInput('input[name*="city" i]', userData.city),
    () => fillInput('input[name*="state" i]', userData.state),
    () => fillInput('input[name*="zip" i], input[name*="postal" i]', userData.zip_code),
    () => fillInput('input[name*="country" i]', userData.country)
  ];

  // Execute all input fill attempts
  inputAttempts.forEach(attempt => attempt());

  // Handle textareas (like cover letter, additional information)
  const textareas = document.querySelectorAll('textarea');
  textareas.forEach(el => {
    const labelElement = el.closest('div')?.querySelector('label');
    const labelText = labelElement?.textContent?.toLowerCase() || '';
    const fieldId = el.id?.toLowerCase() || '';
    const fieldName = el.name?.toLowerCase() || '';

    // Try to detect what kind of field this is
    if (labelText.includes('cover') || fieldId.includes('cover') || fieldName.includes('cover')) {
      el.value = userData.cover_letter || '';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('Filled cover letter');
    }
    
    // Custom question handling based on user-defined answers
    if (userData.custom_answers) {
      for (const [key, value] of Object.entries(userData.custom_answers)) {
        if (labelText.includes(key.toLowerCase())) {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          console.log(`Filled custom answer for: ${key}`);
        }
      }
    }
  });

  // Handle select dropdowns
  const selects = document.querySelectorAll('select');
  selects.forEach(select => {
    const labelElement = select.closest('div')?.querySelector('label');
    const labelText = labelElement?.textContent?.toLowerCase() || '';
    const fieldId = select.id?.toLowerCase() || '';
    
    // Education level
    if (labelText.includes('education') || labelText.includes('degree') || 
        fieldId.includes('education') || fieldId.includes('degree')) {
      const educationLevel = userData.education_level;
      if (educationLevel) {
        // Try to find a matching option
        for (const option of select.options) {
          if (option.text.toLowerCase().includes(educationLevel.toLowerCase())) {
            select.value = option.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`Selected education level: ${option.text}`);
            break;
          }
        }
      }
    }
  });

  // Resume Upload
  const uploadEl = document.querySelector('input[type="file"]') as HTMLInputElement | null;
  if (uploadEl && userData.resume) {
    try {
      const arr = userData.resume.split(',');
      const match = arr[0].match(/:(.*?);/);
      if (match && match[1]) {
        const mime = match[1];
        const bstr = atob(arr[1]);
        const u8arr = new Uint8Array(bstr.length);
        for (let i = 0; i < bstr.length; ++i) u8arr[i] = bstr.charCodeAt(i);
        const file = new File([u8arr], "resume.pdf", { type: mime });

        const dt = new DataTransfer();
        dt.items.add(file);
        uploadEl.files = dt.files;
        uploadEl.dispatchEvent(new Event('change', { bubbles: true }));
        console.log("Resume uploaded");
      }
    } catch (error) {
      console.error("Failed to upload resume:", error);
    }
  }

  console.log("Workday autofill completed.");
}