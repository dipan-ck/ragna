'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { Input } from '@/components/ui/Input'
import { TextArea } from '@/components/ui/TextArea'
import { SubmitButton } from '@/components/ui/submitButton'
import { Mail, User, ArrowLeft } from 'lucide-react'
import { SuccessToast, ErrorToast } from '@/components/ui/Toast'

function validateEmail(email: string) {
  // Simple email regex for validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})

  // Use a ref to access the textarea DOM node directly
  const messageRef = useRef<HTMLTextAreaElement | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
  }

  const validateFields = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Enter a valid email'
    }
    // Use ref value for message to ensure it's up to date
    const messageValue = messageRef.current ? messageRef.current.value : formData.message
    if (!messageValue.trim()) {
      newErrors.message = 'Feedback is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Use ref value for message to ensure it's sent
    const messageValue = messageRef.current ? messageRef.current.value : formData.message

    if (!validateFields()) {
      ErrorToast('Please fill all fields correctly.')
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        // Send as 'feedback' to match backend expectations
        feedback: messageValue,
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/feedback/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        SuccessToast('Feedback submitted successfully!')
        setFormData({ name: '', email: '', message: '' })
        setErrors({})
        if (messageRef.current) {
          messageRef.current.value = ''
        }
      } else {
        ErrorToast(data.message || 'Failed to submit feedback')
      }
    } catch (err) {
      console.error(err)
      ErrorToast('Server error while submitting feedback')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative">
      {/* Back to Dashboard button */}
      <Link
        href="/dashboard"
        className="absolute top-6 left-6 flex items-center bg-[#1a1a1a] py-3 px-4 rounded-xl gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium z-10"
        aria-label="Back to Dashboard"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
      <div className="w-full max-w-md rounded-3xl p-8 mx-auto">
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>

          <div className="text-center space-y-2 w-full">
            <h1 className="text-2xl tracking-tight font-medium text-white">We&apos;d love your feedback</h1>
            <p className="text-sm text-white/70">Let us know what you think</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 w-full mt-6" noValidate>
            <div>
              <Input
                id="name"
                name="name"
                type="text"
                label="Name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                icon={<User className="h-4 w-4" />}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1" id="name-error">{errors.name}</p>
              )}
            </div>

            <div>
              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                icon={<Mail className="h-4 w-4" />}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1" id="email-error">{errors.email}</p>
              )}
            </div>

            <div>
              <TextArea
                id="message"
                name="message"
                label="Your Feedback"
                placeholder="Write your feedback here..."
                value={formData.message}
                onChange={handleChange}
                inputRef={messageRef}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <p className="text-xs text-red-500 mt-1" id="message-error">{errors.message}</p>
              )}
            </div>

            <SubmitButton
              type="submit"
              isLoading={isLoading}
              label="Submit Feedback"
              loadingLabel="Submitting..."
            />
          </form>
        </div>
      </div>
    </main>
  )
}
