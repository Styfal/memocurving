import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { quizSchema } from '../create-tests'
import { z } from 'zod'
import { RadioGroupItem } from '../ui/radio-group'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'

interface OptionItemProps {
    register: UseFormRegister<z.infer<typeof quizSchema>>
    errors: FieldErrors<z.infer<typeof quizSchema>>
    questionIndex: number;
    optionIndex: number;
    removeOption: (index: number) => void;
}

const optionItem = ({ register, questionIndex, optionIndex, removeOption, errors}: OptionItemProps) => {
  return (
      <div className='flex items-center gap-x-2 gap-y-2'>
          <RadioGroupItem
              {...register(`questions.${questionIndex}.options.${optionIndex}.isCorrect` as const)}
              value={`questions.${questionIndex}.options.${optionIndex}.isCorrect`}
              id={`questions.${questionIndex}.options.${optionIndex}.isCorrect`}
          />
          <Input {...register(`questions.${questionIndex}.options.${optionIndex}.optionText`)} />
          <Button onClick={() => removeOption(optionIndex)} type='button'>
              <Trash2 className='h-4 w-4'/>
          </Button>
          {errors?.questions?.[questionIndex]?.options?.[optionIndex]
              && <p className='text-red-500'>{errors?.questions?.[questionIndex]?.options?.[optionIndex]?.isCorrect?.message
                  || errors?.questions?.[questionIndex]?.options?.[optionIndex]?.optionText?.message}</p>}
      </div>
  )
}

export default optionItem