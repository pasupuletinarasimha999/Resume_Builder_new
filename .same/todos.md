# Resume Builder - Remove Sections

## Tasks to Complete

- [x] Remove conferencing/workshops section from resumeSections array (line 27)
- [x] Remove competitions section from resumeSections array (line 26)
- [x] Remove volunteering section from resumeSections array (line 25)
- [x] Remove publications section from resumeSections array (line 24)
- [x] Test that the application still works after removing these sections

## Notes
- These sections are in the `resumeSections` array starting around line 14 in `src/app/page.tsx`
- Need to remove the objects with ids: 'publications', 'volunteering', 'competitions', 'conferences'
- The sections are only in the sidebar navigation and don't have implemented functionality yet (they show "Section coming soon...")
