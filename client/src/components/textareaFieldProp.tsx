import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { Input, Textarea } from '@chakra-ui/react';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { useField } from 'formik';


// Now our input can take all psbl props that regular <input> tag takes
type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  name: string;
  label: string;
};

// '' => false
// 'error message stuff' => true

const TextAreaField: React.FC<TextareaFieldProps> = ({label, ...props}) => {
  const [field, {error}] = useField(props);  // Formik Hook
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Textarea {...field} {...props} id={field.name} placeholder={props.placeholder} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null }
    </FormControl>
  )
}

export default TextAreaField;