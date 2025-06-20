import { type  forwardRef, createContext, useContext, useState } from "react"
import type { ReactNode } from "react"

// Context for sharing state between components
interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = createContext<SelectContextType | undefined>(undefined)

// Custom hook for components to access the Select context
const useSelectContext = () => {
  const context = useContext(SelectContext)
  if (!context) {
    throw new Error("Select components must be used within a Select component")
  }
  return context
}

// Props for main Select component
interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
  className?: string
}

// Props for sub-components
interface SelectTriggerProps {
  children: ReactNode
  className?: string
}

interface SelectValueProps {
  placeholder: string
  className?: string
}

interface SelectContentProps {
  children: ReactNode
  className?: string
}

interface SelectItemProps {
  value: string
  children: ReactNode
  className?: string
}

// Main Select component
const Select = ({ value, onValueChange, children, className = "" }: SelectProps) => {
  const [open, setOpen] = useState(false)

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className={`relative ${className}`}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

// Trigger button component
const SelectTrigger = ({ children, className = "" }: SelectTriggerProps) => {
  const { open, setOpen } = useSelectContext()
  
  const triggerStyle = `flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`
  
  return (
    <button 
      type="button"
      className={triggerStyle}
      onClick={() => setOpen(!open)}
    >
      {children}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="h-4 w-4 opacity-50"
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
  )
}

// Component to display selected value
const SelectValue = ({ placeholder, className = "" }: SelectValueProps) => {
  const { value } = useSelectContext()
  
  return (
    <span className={className}>
      {value || placeholder}
    </span>
  )
}

// Dropdown content component
const SelectContent = ({ children, className = "" }: SelectContentProps) => {
  const { open } = useSelectContext()
  
  if (!open) return null
  
  const contentStyle = `absolute mt-1 max-h-60 min-w-[8rem] overflow-auto rounded-md border border-gray-300 bg-white p-1 text-sm shadow-md z-50 w-full ${className}`
  
  return (
    <div className={contentStyle}>
      {children}
    </div>
  )
}

// Select item component
const SelectItem = ({ value, children, className = "" }: SelectItemProps) => {
  const { value: selectedValue, onValueChange, setOpen } = useSelectContext()
  
  const isSelected = value === selectedValue
  
  const itemStyle = `relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none ${
    isSelected ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
  } ${className}`
  
  const handleClick = () => {
    onValueChange(value)
    setOpen(false)
  }
  
  return (
    <div 
      className={itemStyle}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }