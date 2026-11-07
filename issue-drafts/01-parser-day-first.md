# [4471 split] Shared parser flips dates for day-first tenants — 379 reports

## Problem

The shared date parser reads month first. Tenants whose locale writes day first therefore get flipped dates in bookings and calendar invites. The export's tenant and form data place 379 unique reports in this parser cause.

The five reports noted by the desk as one-day moves are included in these 379 reports; they are not a third cause group. The export has 15 duplicate rows, which are counted once by report ID.

## Outcome

The engineering update on the Challenge page says this was fixed by `fix(dates): parse dd/mm for eu locales`.