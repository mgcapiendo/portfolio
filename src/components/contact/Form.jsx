"use client"
import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import emailjs from "@emailjs/browser";
import { Toaster, toast } from 'sonner';

export default function Form() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm();

  const sendEmail = async (params) => {
    try {
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_SERVICE_ID,
        process.env.NEXT_PUBLIC_TEMPLATE_ID,
        params,
        {
          publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
          limitRate: {
            throttle: 10000,
          }
        }
      );
      
      console.log('SUCCESS!', result);
      toast.success('Message sent successfully!');
      reset();
      return true;
    } catch (error) {
      console.error('FAILED...', error);
      toast.error('Failed to send message. Please try again.');
      return false;
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    const templateParams = {
      to_name: "Manuel Capiendo",
      from_name: data.name,
      reply_to: data.email,
      message: data.message,
    };

    try {
      await sendEmail(templateParams);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className='max-w-md w-full flex flex-col items-center justify-center space-y-4'
      >
        <input 
          type="text" 
          placeholder="Name" 
          {...register("name", {
            required: 'This field is required!',
            minLength: {
              value: 3,
              message: "Name should be at least 3 characters long."
            }
          })}
          className='w-full p-2 rounded-md shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 custom-bg'
          disabled={isSubmitting}
        />
        
        {errors.name && 
          <span className="inline-block self-start text-accent">
            {errors.name.message}
          </span>
        }
        
        <input 
          type="email" 
          placeholder="Email" 
          {...register("email", {
            required: 'This field is required!',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
          className='w-full p-2 rounded-md shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 custom-bg'
          disabled={isSubmitting}
        />
        
        {errors.email && 
          <span className="inline-block self-start text-accent">
            {errors.email.message}
          </span>
        }
        
        <textarea
          placeholder='Message'
          {...register("message", {
            required: 'This field is required!',
            maxLength: {
              value: 500,
              message: "Message should be less than 500 characters"
            },
            minLength: {
              value: 10,
              message: "Message should be more than 10 characters"
            }
          })}
          className='w-full p-2 rounded-md shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 custom-bg'
          disabled={isSubmitting}
        />
        
        {errors.message && 
          <span className="inline-block self-start text-accent">
            {errors.message.message}
          </span>
        }
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-10 py-4 rounded-md shadow-lg bg-background border border-accent/30 border-solid
            hover:shadow-glass-sm background-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50
            cursor-pointer capitalize ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </form>
    </>
  );
}
