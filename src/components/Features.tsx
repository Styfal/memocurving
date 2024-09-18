import Image from "next/image";
import Feature1 from "../../public/assets/feature-1.svg"
import Feature2 from "../../public/assets/feature-2.svg"
import Feature3 from "../../public/assets/feature-3.svg"
import Check from "../../public/assets/check.svg"
import BlueButton from "../../public/assets/blue-button.svg"
import GreenButton from "../../public/assets/green-button.svg"
import PinkButton from "../../public/assets/pink-button.svg"
import { CheckIcon } from "lucide-react";


export function Features(){
    return(
         <div className="flex flex-col gap-y-[56px] py-[56px] lg:py-[120px] lg:gap-y-[80px] ">
                <div className="flex flex-col gap-x-6 sm:flex-row-reverse">
                    <Image src={Feature1} alt="featur1image" className="hidden w-1/2 sm:block transition-transform duration-300 hover:scale-105"/>
                    <div className="sm:w-1/2 lg:py-[56px] lg:pr-{56px]">
                        <h3 className="font-medium lg:text-[18px] text-[#3670FF]">Robust Quiz Creation</h3>
                        <h1 className="pt-[12px] text-2xl font-medium text-[#3670FF] lg:text-[42px] lg:leading-[58px]">AI Powered Flashcard System </h1>
                        <Image src={Feature1} alt="feature-1-image" className="pt-[24px] sm:hidden" />
                        <p className="py-[24px] lg:text-[18px]">
                            Our system will recognize your study habits, strengths, and weaknesses and organize the 
                            flashcards you made to optimize your study and improve your memory retention drastically. 
                        </p>

                        <ul className="flex flex-col gap-y-3 lg:text-[18px]">
                            <li className="flex items-center gap-x-2">
                                <span className="text-blue-500"> <CheckIcon size={20}></CheckIcon></span>
                                Serial Repositioning System 
                            </li>
                            <li className="flex items-center gap-x-2">
                            <span className="text-blue-500"> <CheckIcon size={20}></CheckIcon></span>
                                Strength to Weakness Calculator  
                            </li>
                            <li className="flex items-center gap-x-2 ">
                            <span className="text-blue-500"> <CheckIcon size={20}></CheckIcon></span>
                                Spaced Repitition System
                            </li>

                        </ul>
                        <p className="flex items-center pt-[24px] gap-x-2 text-[#3670FF] font-medium lg:text-[18px]">
                            Learn More <span><Image src={BlueButton} alt="blueButton"/></span>
                        </p>

                       
                    </div>
                </div>



                <div className="flex flex-col gap-x-6 sm:flex-row">
                    <Image src={Feature2} alt="featur1image2" className="hidden w-1/2 sm:block transition-transform duration-300 hover:scale-105"/>
                    <div className="sm:w-1/2 lg:py-[56px] lg:pl-[56px]">
                        <h3 className="font-medium text-[#3670FF] lg:text-[18px]">Immersive Customization</h3>
                        <h1 className="pt-[12px] text-2xl font-medium text-[#3670FF] lg:text-[42px] lg:leading-[58px]">Instill creativity into your studies </h1>
                        <Image src={Feature2} alt="feature-2-image" className="pt-[24px] sm:hidden" />
                        <p className="py-[24px] lg:text-[18px]">
                            Memocurve offers various custom features to create a digital studying environment that is the most 
                            comfortable for you. Freely organize your flaschards based on what is best for you. 
                        </p>

                        <ul className="flex flex-col gap-y-3 lg:text-[18px]">
                            <li className="flex items-center gap-x-2">
                                <span><Image src={Check} alt={"check mark"} /></span>
                                Versatile Quiz Formation 
                            </li>
                            <li className="flex items-center gap-x-2">
                                <span><Image src={Check} alt={"check mark"} /></span>
                                Adjustable Theme 
                            </li>
                            <li className="flex items-center gap-x-2">
                                <span><Image src={Check} alt={"check mark"} /></span>
                               Eye-catching color palette 
                            </li>

                        </ul>
                        <p className="flex items-center pt-[24px] gap-x-2 text-[#3670FF] font-medium lg:text-[18px]">
                            Learn More <span><Image src={BlueButton} alt="Blue Button"/></span>
                        </p>

                       
                    </div>
                </div>

                <div className="flex flex-col gap-x-10 sm:flex-row-reverse">
                    <Image src={Feature3} alt="featur1image" className="hidden w-1/2 sm:block transition-transform duration-300 hover:scale-105 rounded-2xl"/>
                    <div className="sm:w-1/2 lg:py-[56px] lg:pr-{56px]">
                        <h3 className="font-medium text-[#3670FF] lg:text-[18px] px-1"> Deep focus mode</h3>
                        <h1 className="pt-[12px] text-2xl font-medium text-[#3670FF] lg:text-[42px] lg:leading-[58px]">AI Powered Flashcard System </h1>
                        <Image src={Feature3} alt="feature-1-image" className="pt-[24px] sm:hidden" />
                        <p className="py-[25px] lg:text-[18px]">
                           This feature supresses unnecessary activies on your mobile devices so you can concentrate on memorizing for 
                           your subject. 
                        </p>

            <div className="flex w-full gap-x-[24px]">
                  <div className="w-1/2 flex-col gap-y-3">
                     <h3 className="text-[20px] font-medium text-[#3670FF]">100+</h3>
                     <p>Downloads</p>
                        </div>
       
                         <div className=" w-1/2 flex-col gap-y-3">
                          <h3 className="text-[20px] font-medium text-[#3670FF]">800+</h3>
                             <p>Complaints</p>
                     </div>
                </div>
                        
                        <p className="flex items-center pt-[24px] gap-x-2 text-[#3670FF] font-medium lg:text-[18px]">
                            Learn More <span><Image src={BlueButton} alt="Blue Button"/></span>
                        </p>

                       
                    </div>
                </div>
         </div>
    );
}