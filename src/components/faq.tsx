import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "./ui/accordion"

export default function FrequentAnswers() {
    const faqs = [
        {
            question: "How do you create your own flashcards",
            answer: "After logging in, click on the dropdown on the top and click on create. You will be able access the menu for creating flashcards"
        },
        {
            question: "What are the benefits of getting Pro?",
            answer: "You gain access to increased access to creating flashcards and tests using the AI module, obtain statistical data of your progress with your tests, ad free, custom background music, any more more!"
        },
        {
            question: "I bought Pro but my account is not being updated. What should I do ",
            answer: "For you account to be updated, it will usually take 5-30 minutes. If your account does not get updated by then, please contact customer support."
        },
        {
            question: "What is the difference between Flashcards and Tests",
            answer: "Flashcards are used for general memorization practice whilst the test measures how much you remember from your flashcard and tracks your progress"
        },
        {
            question: "Is there a mobile version of memocurve?",
            answer: "The mobile version is currently being developed with additional features and interface students can use to accelerate there learning. Be on the lookout"
        },
        {
            question: "Am I able to use flashcards and tests made by other people?",
            answer: "Absolutely! Users can publish or share their creations to others. You can check out published cards in the cards page and you are able to share content from your create page"
        },
        
    ]
    return(
        <div className="flex flex-col">
            <div className="container mt-10 mx-auto px-4">
                <h1 className="font-bold text-4xl text-cyan-600 mb-8">
                    Frequently Asked Questions
                </h1>
            </div>
            <main className="flex-grow container mx-auto px-4 mb-12">
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className="bg-white rounded-lg shadow">
                            <AccordionTrigger className="text-cyan-600 hover:text-cyan-700 px-6 py-4">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4 text-gray-700">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </main>
            <div className="container mx-auto px-4 pb-12">
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-xl shadow-lg overflow-hidden text-white transition-transform duration-250 hover:scale-105 max-w-md mx-auto">
                    <header className="font-bold pt-7 pb-3 text-3xl text-center">
                        Start Learning Efficiently
                    </header>
                    <p className="mb-5 text-center font-bold">
                        From a 2.0 to a 4.0 GPA instantly. 
                    </p>
                    <div className="flex justify-center pb-6">
                        <Link href="/create">
                            <button className="bg-white text-cyan-600 font-bold py-2 px-6 rounded-full hover:bg-cyan-500 hover:text-white hover:scale-105 transition-colors  duration-300">
                                Create
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}