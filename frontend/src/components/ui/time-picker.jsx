import * as React from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ClockIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const TimePicker = ({ value, onChange, className }) => {
  // Parse the current value into hours and minutes
  const [hours, minutes] = value ? value.split(":") : ["12", "00"]

  // Generate hours and minutes options
  const hoursOptions = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, "0")
  )
  const minutesOptions = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, "0")
  )

  const handleHoursChange = (newHours) => {
    onChange(`${newHours}:${minutes}`)
  }

  const handleMinutesChange = (newMinutes) => {
    onChange(`${hours}:${newMinutes}`)
  }

  return (
    <div className={cn("flex gap-2", className)}>
      <Select value={hours} onValueChange={handleHoursChange}>
        <SelectTrigger className="w-20">
          <ClockIcon className="mr-2 h-4 w-4" />
          <SelectValue>{hours}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {hoursOptions.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <span className="flex items-center">:</span>
      <Select value={minutes} onValueChange={handleMinutesChange}>
        <SelectTrigger className="w-20">
          <SelectValue>{minutes}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {minutesOptions.map((minute) => (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default TimePicker