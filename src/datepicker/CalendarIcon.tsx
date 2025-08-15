interface CalendarIconProps {
    size?: number;
}

const CalendarIcon = ({ size = 25 }: CalendarIconProps) => {
    return (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" opacity=".8" aria-hidden="true" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
            <rect width="416" height="384" x="48" y="80" fill="none" strokeLinejoin="round" strokeWidth="32" rx="48"/>
            <circle cx="296" cy="232" r="24" stroke="none"/>
            <circle cx="376" cy="232" r="24" stroke="none"/>
            <circle cx="296" cy="312" r="24" stroke="none"/>
            <circle cx="376" cy="312" r="24" stroke="none"/>
            <circle cx="136" cy="312" r="24" stroke="none"/>
            <circle cx="216" cy="312" r="24" stroke="none"/>
            <circle cx="136" cy="392" r="24" stroke="none"/>
            <circle cx="216" cy="392" r="24" stroke="none"/>
            <circle cx="296" cy="392" r="24" stroke="none"/>
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M128 48v32m256-32v32"/>
            <path fill="none" strokeLinejoin="round" strokeWidth="32" d="M464 160H48"/>
            </svg>
    )
}

export default CalendarIcon;