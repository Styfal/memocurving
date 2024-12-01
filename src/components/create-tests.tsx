"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, PlusCircle, Trash2 } from "lucide-react";

import { Input } from "./ui/input";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

//Validation Check Imports
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "@/lib/AuthContext";
import { root } from "postcss";
import QuestionItem from "./test/questionItem";

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
        }),
});

export const quizSchema = z.object({
    title: z.string().min(1, { message: "A title is required" }),
    description: z.string(),
    questions: z
        .array(questionSchema)
        .min(1, "At least one question is required"),
    userId: z.string().min(1, "userId is required"),
});

type formFields = z.infer<typeof quizSchema>;

const CreateTest = ({ onBack }: { onBack: () => void }) => {
    const {
        register,
        handleSubmit,
        setError,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<formFields>({
        defaultValues: {
            title: "",
            description: "",
            questions: [],
        },
        resolver: zodResolver(quizSchema),
    });

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "questions",
    });

    const addQuestion = () => {
        append({
            questionText: "", 
            options: [],
        })
    }

    const removeQuestion = (index: number) => {
        remove(index)
    }

    const onSubmit: SubmitHandler<formFields> = async (data) => {
        console.log("aaaaaa");
        try {
            console.log(data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
            setError("root", {
                message: "Something went wrong when creating the test!",
            });
        }
    };

    return (
        <div className="w-full max-w-4xl">
            <Button type="button" onClick={onBack}>Back to list</Button>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div>
                    <label htmlFor="title">Title</label>
                    <Input {...register("title")} id="title" placeholder="Enter the title of your test" />
                    {errors.title && <div className="text-red-500">{errors.title.message}</div>}
                </div>

                {fields.map((field, index) => (
                    <QuestionItem
                        key={field.id}
                        register={register}
                        control={control}
                        errors = { errors }
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