"use client";

import React from "react";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import { Input } from "./ui/input";
import { useFieldArray, useForm, SubmitHandler } from "react-hook-form";
import { useAuthContext } from "@/lib/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import QuestionItem from "./test/questionItem";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


export const optionSchema = z.object({
    optionText: z.string().min(1, "Option text is required"),
    isCorrect: z.boolean(),
});

export const questionSchema = z.object({
    questionText: z.string().min(1, "Question text is required"),
    options: z
        .array(optionSchema)
        .min(2, "Each question must have at least 2 options")
        .max(4, "Each question can have a maximum of 4 options")
        .refine((options) => options.some((o) => o.isCorrect), {
            message: "At least one option must be marked as correct",
        })
});

export const quizSchema = z.object({
    title: z.string().min(1, { message: "A title is required" }),
    questions: z
        .array(questionSchema)
        .min(1, "At least one question is required"),
    userId: z.string().min(1, "userId is required"),
});

type formFields = {
    title: string;
    questions: {
        questionText: string;
        options: {
            optionText: string;
            isCorrect: boolean;
        }[];
    }[];
    userId: string;
};

const CreateTest = ({ onBack }: { onBack: () => void }) => {
    const { user } = useAuthContext();

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, isSubmitting },
    } = useForm<formFields>({
        defaultValues: {
            title: "",
            questions: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "questions",
    });

    const addQuestion = () => {
        append({
            questionText: "",
            options: [],
        });
    };

    const removeQuestion = (index: number) => {
        remove(index);
    };

    const onSubmit: SubmitHandler<formFields> = async (data) => {
        try {
            // Add the current user's UID to the form data
            const testData = {
                ...data,
                userId: user.uid,
                createdAt: new Date(), // Add timestamp
            };

            // Save to Firestore
            const testsCollectionRef = collection(db, "tests");
            const docRef = await addDoc(testsCollectionRef, testData);

            console.log("Test created with ID: ", docRef.id);
            
            // Optional: Reset form or navigate away
            onBack(); // Or use a router to navigate to test list
        } catch (error) {
            console.error("Error creating test:", error);
            setError("root", {
                message: "Something went wrong when creating the test!",
            });
        }
    };

    return (
        <div className="w-full max-w-4xl">
            <Button type="button" onClick={onBack}>
                Back to list
            </Button>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="title">Title</label>
                    <Input
                        {...register("title", { required: "Title is required" })}
                        id="title"
                        placeholder="Enter the title of your test"
                    />
                    {errors.title && (
                        <div className="text-red-500">
                            {errors.title.message}
                        </div>
                    )}
                </div>

                {fields.map((field, index) => (
                    <QuestionItem
                        key={field.id}
                        register={register}
                        control={control}
                        errors={errors}
                        questionIndex={index}
                        removeQuestion={removeQuestion}
                    />
                ))}

                <Button type="button" onClick={addQuestion}>
                    <PlusCircle className="h-4 w-4" /> Add Question
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                    Create Test
                </Button>
            </form>
        </div>
    );
};

export default CreateTest;