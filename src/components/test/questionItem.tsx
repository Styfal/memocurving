import React from 'react'
import { Control, FieldErrors, UseControllerProps, useFieldArray, UseFormRegister } from 'react-hook-form'
import { z } from 'zod'
import { questionSchema, quizSchema } from '../create-tests'
import { Card, CardContent, CardHeader } from '../ui/card';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import OptionItem from './optionItem';
import { RadioGroup } from '../ui/radio-group';
import { Input } from '../ui/input';

interface QuestionItemProps {
    register: UseFormRegister<z.infer<typeof quizSchema>>;
    control: Control<z.infer<typeof quizSchema>>;
    errors: FieldErrors<z.infer<typeof quizSchema>>;
    questionIndex: number;
    removeQuestion: (index: number) => void;
}

const QuestionItem = ({ register, control, questionIndex, removeQuestion, errors }: QuestionItemProps) => {

    const { fields, append, remove } = useFieldArray({
        control, 
        name: `questions.${questionIndex}.options` as "questions.0.options",
    })

    const addOption = () => {
        append({
            optionText: "",
            isCorrect: false,
         })
    }

    const removeOption = (optionIndex: number) => {
        remove(optionIndex);
    }

  return (
      <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
                <p className=''>Question {questionIndex + 1}</p>
              <Button onClick = {() => removeQuestion(questionIndex)} variant="ghost" className='text-red-500 hover:text-red-500 hover:bg-red-500/20'>
                  <Trash2 className='h-4 w-4'/>
              </Button>
          </CardHeader>
          <CardContent className='flex flex-col gap-y-2'>
              <Input {...register(`questions.${questionIndex}.questionText`)} placeholder='Enter your question' />
              {errors?.questions?.[questionIndex]?.questionText && <div className="text-red-500">{errors?.questions?.[questionIndex]?.questionText?.message}</div>}
              <RadioGroup>
                  
                {fields.map((field, index) => (
                    <OptionItem
                        key={field.id}
                        register={register}
                        errors={errors}
                        questionIndex={questionIndex}
                        optionIndex={index}
                        removeOption={removeOption}
                    />
                    
                ))}
              </RadioGroup>
              <Button onClick={addOption} type='button' variant="outline" className=''>
                  Add an option
              </Button>
          </CardContent>
    </Card>
  )
}

export default QuestionItem