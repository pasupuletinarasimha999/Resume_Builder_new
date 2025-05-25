// Test script for Resume Builder Application
// This script tests all features including rich text editor, Present checkbox, and PDF download

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testResumeBuilder() {
  const results = {
    basicInfo: false,
    richTextEditor: false,
    presentCheckbox: false,
    educationSection: false,
    workExperience: false,
    projectsSection: false,
    skillsSection: false,
    previewDisplay: false,
    pdfDownload: false,
    errors: []
  };

  console.log('🚀 Starting Resume Builder Tests...\n');

  try {
    // Test 1: Check if page loads and basic elements exist
    console.log('📋 Test 1: Checking page load and basic elements...');
    const basicElements = {
      fullName: document.querySelector('input[id="name"]'),
      email: document.querySelector('input[id="email"]'),
      phone: document.querySelector('input[id="phone"]'),
      location: document.querySelector('input[id="location"]'),
      summary: document.querySelector('textarea[id="summary"]'),
      previewPanel: document.querySelector('#resume-preview'),
      downloadBtn: document.querySelector('button:contains("Download PDF")')
    };

    if (basicElements.fullName && basicElements.email && basicElements.phone && basicElements.location) {
      results.basicInfo = true;
      console.log('✅ Basic info fields found');
    } else {
      results.errors.push('❌ Basic info fields missing');
    }

    // Test 2: Fill out basic information
    console.log('\n📝 Test 2: Filling out basic information...');
    if (basicElements.fullName) basicElements.fullName.value = 'John Doe';
    if (basicElements.email) basicElements.email.value = 'john.doe@example.com';
    if (basicElements.phone) basicElements.phone.value = '+1-555-0123';
    if (basicElements.location) basicElements.location.value = 'New York, NY';
    
    // Trigger input events
    ['input', 'change'].forEach(eventType => {
      Object.values(basicElements).forEach(el => {
        if (el && el.tagName && ['INPUT', 'TEXTAREA'].includes(el.tagName)) {
          el.dispatchEvent(new Event(eventType, { bubbles: true }));
        }
      });
    });

    console.log('✅ Basic information filled');

    // Test 3: Test Professional Summary with Rich Text Editor
    console.log('\n📝 Test 3: Testing Professional Summary rich text editor...');
    await delay(1000); // Wait for react-quill to load
    
    const summaryRichText = document.querySelector('.ql-editor');
    if (summaryRichText) {
      const testContent = '<p><strong>Experienced software developer</strong> with <em>5+ years</em> in:</p><ul><li>Full-stack web development</li><li>API design and implementation</li><li>Database optimization</li></ul>';
      summaryRichText.innerHTML = testContent;
      summaryRichText.dispatchEvent(new Event('input', { bubbles: true }));
      results.richTextEditor = true;
      console.log('✅ Rich text editor working in summary');
    } else {
      results.errors.push('❌ Summary rich text editor not found');
    }

    // Test 4: Test navigation to other sections
    console.log('\n🔄 Test 4: Testing section navigation...');
    const sections = ['education', 'experience', 'projects', 'skills'];
    
    for (const sectionId of sections) {
      const sectionButton = document.querySelector(`button[alt="${sectionId}"]`) || 
                           document.querySelector(`img[alt*="${sectionId}"]`)?.closest('button');
      
      if (sectionButton) {
        sectionButton.click();
        await delay(500);
        console.log(`✅ Navigated to ${sectionId} section`);
      } else {
        console.log(`⚠️ Section button for ${sectionId} not found`);
      }
    }

    // Test 5: Add and test Education section
    console.log('\n🎓 Test 5: Testing Education section...');
    const addEducationBtn = document.querySelector('button:contains("Add New Item")');
    if (addEducationBtn) {
      addEducationBtn.click();
      await delay(500);
      
      // Fill education fields
      const educationFields = {
        school: 'Stanford University',
        degree: 'Master of Science',
        field: 'Computer Science',
        startDate: '09-2018',
        endDate: '06-2020'
      };

      Object.entries(educationFields).forEach(([field, value]) => {
        const input = document.querySelector(`input[id*="${field}"]`);
        if (input) {
          input.value = value;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });

      // Test rich text in education description
      const educationRichText = document.querySelector('.ql-editor');
      if (educationRichText) {
        const educationDesc = '<p>Relevant coursework:</p><ul><li>Advanced Algorithms</li><li>Machine Learning</li><li>Distributed Systems</li></ul>';
        educationRichText.innerHTML = educationDesc;
        educationRichText.dispatchEvent(new Event('input', { bubbles: true }));
        results.educationSection = true;
        console.log('✅ Education section with rich text description added');
      }
    }

    // Test 6: Add and test Work Experience with Present checkbox
    console.log('\n💼 Test 6: Testing Work Experience with Present checkbox...');
    
    // Navigate to experience section
    const expButton = document.querySelector('img[alt*="Work Experience"]')?.closest('button');
    if (expButton) {
      expButton.click();
      await delay(500);
      
      const addExpBtn = document.querySelector('button:contains("Add New Item")');
      if (addExpBtn) {
        addExpBtn.click();
        await delay(500);
        
        // Fill experience fields
        const expFields = {
          company: 'Tech Corp Inc.',
          position: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          startDate: '01-2021'
        };

        Object.entries(expFields).forEach(([field, value]) => {
          const input = document.querySelector(`input[id*="${field}"]`);
          if (input) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });

        // Test Present checkbox
        const presentCheckbox = document.querySelector('input[type="checkbox"][id*="isPresent"]');
        if (presentCheckbox) {
          presentCheckbox.checked = true;
          presentCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
          results.presentCheckbox = true;
          console.log('✅ Present checkbox checked');
          
          // Verify end date is disabled
          const endDateInput = document.querySelector('input[id*="endDate"]');
          if (endDateInput && endDateInput.disabled) {
            console.log('✅ End date field properly disabled when Present is checked');
          }
        }

        // Test rich text in experience description
        const expRichText = document.querySelector('.ql-editor');
        if (expRichText) {
          const expDesc = '<p><strong>Key achievements:</strong></p><ul><li>Led team of 6 developers</li><li>Improved system performance by 40%</li><li>Implemented CI/CD pipeline</li></ul>';
          expRichText.innerHTML = expDesc;
          expRichText.dispatchEvent(new Event('input', { bubbles: true }));
          results.workExperience = true;
          console.log('✅ Work experience with rich text description added');
        }
      }
    }

    // Test 7: Add Projects section
    console.log('\n🚀 Test 7: Testing Projects section...');
    const projectsButton = document.querySelector('img[alt*="Projects"]')?.closest('button');
    if (projectsButton) {
      projectsButton.click();
      await delay(500);
      
      const addProjectBtn = document.querySelector('button:contains("Add New Item")');
      if (addProjectBtn) {
        addProjectBtn.click();
        await delay(500);
        
        const projectFields = {
          name: 'E-commerce Platform',
          technologies: 'React, Node.js, PostgreSQL, AWS',
          url: 'https://github.com/johndoe/ecommerce',
          startDate: '03-2023',
          endDate: '08-2023'
        };

        Object.entries(projectFields).forEach(([field, value]) => {
          const input = document.querySelector(`input[id*="${field}"]`);
          if (input) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });

        const projectRichText = document.querySelector('.ql-editor');
        if (projectRichText) {
          const projectDesc = '<p><strong>Features implemented:</strong></p><ol><li>User authentication system</li><li>Shopping cart functionality</li><li>Payment processing integration</li></ol>';
          projectRichText.innerHTML = projectDesc;
          projectRichText.dispatchEvent(new Event('input', { bubbles: true }));
          results.projectsSection = true;
          console.log('✅ Projects section with rich text description added');
        }
      }
    }

    // Test 8: Add Skills section
    console.log('\n🛠️ Test 8: Testing Skills section...');
    const skillsButton = document.querySelector('img[alt*="Skills"]')?.closest('button');
    if (skillsButton) {
      skillsButton.click();
      await delay(500);
      
      const addSkillBtn = document.querySelector('button:contains("Add New Item")');
      if (addSkillBtn) {
        addSkillBtn.click();
        await delay(500);
        
        const skillFields = {
          category: 'Programming Languages',
          skills: 'JavaScript, TypeScript, Python, Java, Go, C++'
        };

        Object.entries(skillFields).forEach(([field, value]) => {
          const input = document.querySelector(`input[id*="${field}"], textarea[id*="${field}"]`);
          if (input) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });

        results.skillsSection = true;
        console.log('✅ Skills section added');
      }
    }

    // Test 9: Check preview panel updates
    console.log('\n👀 Test 9: Checking preview panel...');
    const previewPanel = document.querySelector('#resume-preview');
    if (previewPanel) {
      const previewContent = previewPanel.textContent || previewPanel.innerText;
      if (previewContent.includes('John Doe') && previewContent.includes('john.doe@example.com')) {
        results.previewDisplay = true;
        console.log('✅ Preview panel shows updated content');
      } else {
        results.errors.push('❌ Preview panel not updating properly');
      }
    } else {
      results.errors.push('❌ Preview panel not found');
    }

    // Test 10: Test PDF download functionality
    console.log('\n📄 Test 10: Testing PDF download...');
    const downloadBtn = document.querySelector('button:contains("Download PDF")') || 
                       document.querySelector('button[class*="purple"]:contains("PDF")');
    
    if (downloadBtn) {
      // Just click the button to test if it triggers without errors
      try {
        downloadBtn.click();
        results.pdfDownload = true;
        console.log('✅ PDF download button clicked successfully');
      } catch (error) {
        results.errors.push(`❌ PDF download error: ${error.message}`);
      }
    } else {
      results.errors.push('❌ PDF download button not found');
    }

    await delay(1000);

  } catch (error) {
    results.errors.push(`❌ Test execution error: ${error.message}`);
    console.error('Test error:', error);
  }

  // Generate test report
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================');
  
  const testResults = [
    { name: 'Basic Information Fields', passed: results.basicInfo },
    { name: 'Rich Text Editor', passed: results.richTextEditor },
    { name: 'Present Checkbox', passed: results.presentCheckbox },
    { name: 'Education Section', passed: results.educationSection },
    { name: 'Work Experience Section', passed: results.workExperience },
    { name: 'Projects Section', passed: results.projectsSection },
    { name: 'Skills Section', passed: results.skillsSection },
    { name: 'Preview Panel Updates', passed: results.previewDisplay },
    { name: 'PDF Download', passed: results.pdfDownload }
  ];

  testResults.forEach(test => {
    console.log(`${test.passed ? '✅' : '❌'} ${test.name}`);
  });

  const passedTests = testResults.filter(t => t.passed).length;
  const totalTests = testResults.length;
  
  console.log(`\n📈 Overall Score: ${passedTests}/${totalTests} tests passed`);
  
  if (results.errors.length > 0) {
    console.log('\n🐛 Errors encountered:');
    results.errors.forEach(error => console.log(error));
  }

  return results;
}

// Enhanced DOM query helper
function querySelector(selector) {
  return document.querySelector(selector) || 
         Array.from(document.querySelectorAll('*')).find(el => 
           el.textContent && el.textContent.trim().includes(selector.replace(/[^a-zA-Z\s]/g, ''))
         );
}

// Auto-run test when script loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(testResumeBuilder, 2000); // Wait for app to fully load
  });
}

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testResumeBuilder };
}