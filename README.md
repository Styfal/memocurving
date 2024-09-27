## To the Development team! 

# Version:  Next.js 14.2.5


# Web App Current Progress: 
Frontend: Complete the first draft of the landing page, the actual flashcard ui, the ui for selecting cards you made + global cards. UI for settings, UI for creating and editing cards, tests, and talking to AI. UI for the pricing page, UI for user profile.
Backend: User Authentication (This may need to change to firebase, but we can use mongoDB and use kindeauthentication at the same time), TRPC Type safety setup. 

# Todo: 
Frontend: Add Product Photos to landing page, complete select-cards page (need to make UI when user clicks "view-more" + add photos). UI for conducting tests/quiz that are created whole UI for Pricing  (Cart -> add credentials -> confirm pay -> Completion page), Review of all features currently, DARK MODE AND MORE THEMES!! +
Customer support page, privacy policy, cookies, etc, etc 

# Backend: (Tons of shit) 
- Connecting Database so all user progress is saved and can be fetched including whether user has pro, cards created, profile edits, etc. 
- (Optional) changing kinde authentication system to firebase or NextAuth Authentication for better security 
- Safety features for security such as capping amount of cards /test that can be made, profanity bans, moderation system using admin panel, cap to how much can be written in cards and tests, etc 
- AI API setup on AI Section.
- Anything else i forgot to mention 
- Making the setting section actually commit changes
- I would like users to have the ability to create there own flashcard which creates like its own unique "url" or "key". This should update the frontend in the /courses page where they can see there own cards. There is also global cards but we can talk about this later. So basically, connecting courses page, create cards page, flashcard page and test page (Hasnt been made yet)
- (NEW) Added Testing Page under ./cards/test01. Backend has to make sure users from the create card page can also use the "create test" page to create tests and use that information there to edit the question type, answers, and questions on the testing page accordingly. 

# Extra Information
Comments have been written on the componenets section. If you can check them out that will be great. If there are any other information. Let me know! Happy Coding. 

# Expected completion of 
frontend: within a week or 2
backend: I have no clue






- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
