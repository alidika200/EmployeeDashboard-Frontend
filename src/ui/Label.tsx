import { type LabelHTMLAttributes, forwardRef } from "react"

const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(({ className = "", ...props }, ref) => {
  const labelStyle = `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`;
  
  return (
    <label
      ref={ref}
      className={labelStyle}
      {...props}
    />
  );
})

Label.displayName = "Label"

export { Label }