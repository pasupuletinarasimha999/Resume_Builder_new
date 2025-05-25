# Resume Builder Improvements - Todo List

## Main Tasks
- [ ] Fix preview/download mismatch issue - ensure downloaded resume matches preview exactly
- [x] Add "Present" checkbox option to work experience section for current positions
- [x] Implement rich text formatting for all description fields (bullets, numbering, bold, italic, etc.)

## Current Status
- Rich text editor successfully implemented with SSR fixes
- Present checkbox working correctly for work experience
- Need to test and fix PDF generation to match preview exactly

## Detailed Subtasks

### 1. Fix Preview/Download Mismatch
- [ ] Review current PDF generation logic
- [ ] Ensure consistent styling between preview and PDF
- [ ] Test download to verify match with preview

### 2. Add "Present" Option to Work Experience
- [ ] Add checkbox field for "Currently working here"
- [ ] Update form validation and handling
- [ ] Modify date display logic to show "Present" when checked
- [ ] Update preview rendering for current positions

### 3. Rich Text Formatting for Descriptions
- [ ] Install rich text editor dependencies
- [ ] Create RichTextEditor component
- [ ] Add formatting toolbar (bold, italic, bullets, numbering)
- [ ] Replace textarea components with rich text editor
- [ ] Update preview rendering to handle formatted text
- [ ] Ensure PDF generation preserves formatting

## Status
- Created: $(date)
- Priority: High
- Estimated completion: Today
